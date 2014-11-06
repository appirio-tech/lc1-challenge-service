'use strict';

var parser = require("swagger-parser");
var async = require("async");
var assert = require("assert");
var supertest = require("supertest");
var _ = require('lodash');

var _validate = function (route, obj, expectedResponseDefinition, definitions, currentPath, currentObj) {
  if (!currentPath) {
    currentPath = '';
  }
  if (!currentObj) {
    currentObj = obj;
  }
  // check if all required keypaths are present in the object to validate
  var absentRequiredPaths = _.difference(expectedResponseDefinition.required, Object.keys(currentObj));
  if (absentRequiredPaths.length > 0) {
    console.info('some');
  }
  assert.equal(absentRequiredPaths.length, 0, route + ': required paths ' + absentRequiredPaths.join() + ' not present in path (' + currentPath + ') of response object ' + JSON.stringify(obj));

  var validateArray = function (value) {
    assert.ok(Array.isArray(value), route + ': Expected array but found: ' + JSON.stringify(value));
  };

  var processRef = function (value, fieldPath, propertyDefinition, isArray) {
    var definitionName = isArray ? propertyDefinition.items.$ref : propertyDefinition.$ref;
    var definition = definitions[definitionName];
    assert.ok(definition, route + ': Unexpected reference name in Swagger file: ' + definitionName);
    if (isArray) {
      validateArray(value);
      // validate all items
      value.forEach(function (item) {
        _validate(route, obj, definition, definitions, fieldPath, item);
      })
    } else {
      _validate(route, obj, definition, definitions, fieldPath, value);
    }
  };

  var validateValue = function (value, type, fieldPath, propertyDefinition) {
    switch (type) {
      case 'boolean':
        assert.ok(value.constructor.name === 'Boolean', route + ': boolean value expected, but found (' + value + ') for path (' + fieldPath + ')');
        break;
      case 'integer':
      case 'number':
        assert.ok(value.constructor.name === 'Number', route + ': integer value expected, but found (' + value + ') for path (' + fieldPath + ')');
        break;
      case 'string':
        assert.ok(value.constructor.name === 'String', route + ': string value expected, but found (' + value + ') for path (' + fieldPath + ')');
        if (propertyDefinition.format === 'date-time') {
          assert.ok(new Date(value).toISOString() === value, route + ': date-time formatted string value expected, but found (' + value + ') for path (' + fieldPath + ')');
        }
        break;
      case 'array':
        if (propertyDefinition.items.$ref) {
          if ('minItems' in propertyDefinition.items) {
            assert.ok(value.length >= propertyDefinition.items.minItems, route + ': expected array length of at least ' + propertyDefinition.items.minItems + ' but found ' + value.length + ' for path (' + fieldPath + ')');
          }
          processRef(value, fieldPath, propertyDefinition, true);
        } else if (propertyDefinition.items.type) {
          validateArray(value);
          value.forEach(function (item) {
            validateValue(item, propertyDefinition.items.type, fieldPath, propertyDefinition);
          });
        } else {
          console.info(route + ': Found array definition without a referenced definition or type for path (' + fieldPath + ')');
        }
        break;
      default:
        if (propertyDefinition.$ref) {
          processRef(value, fieldPath, propertyDefinition);
        } else {
          console.info(route + ': Unmatched Swagger type: ' + propertyDefinition.type + '. for path (' + fieldPath + ')');
        }
    }
  };

  // traverse all the keypaths in the response object
  for (var key in currentObj) {
    if (!currentObj.hasOwnProperty(key)) {
      continue;
    }
    var value = currentObj[key];
    var fieldPath = (currentPath.length ? currentPath + '.' : '') + key;

    // get the corresponding keypath definition and assert there is one present
    var propertyDefinition = expectedResponseDefinition.properties[key];
    assert.ok(propertyDefinition, route + ': Found undocumented key (' + fieldPath + ')' + ' in server response ' + JSON.stringify(obj));

    // if null
    if (!value) {
      // assert field not required
      assert.ok(expectedResponseDefinition.required.indexOf(key) === -1, route + ': found null on required field ' + fieldPath);
      continue;
    }

    validateValue(value, propertyDefinition.type, fieldPath, propertyDefinition);
  }
};

var _replaceParams = function (path, replaceMap) {
  var result = path.slice(0);
  Object.keys(replaceMap).forEach(function (key) {
    if (replaceMap[key].constructor.name === 'Object') {
      Object.keys(replaceMap[key]).forEach(function (fullPrefix) {
        if (path.indexOf(fullPrefix) !== -1) {
          result = result.replace('{' + key + '}', replaceMap[key][fullPrefix]);
        }
      });
    } else {
      result = result.replace('{' + key + '}', replaceMap[key]);
    }
  });
  return result;
};

var exports = module.exports = {};

/**
 *
 * @param url url parameter passed to supertest call
 * @param swaggerFilePath file path of the swagger file to use as documentation
 * @param [paramReplacementMap] object in which its keys are params present on endpoints defined on the swagger file and its
 * values are the replacement
 * @param done callback function
 */
exports.validateGetRequests = function (url, swaggerFilePath, paramReplacementMap, done) {
  var options = { dereferencePointers: false };
  parser.parse(swaggerFilePath, options, function (err, swaggerObject) {
    assert.ifError(err);
    // swagger definitions that can be referenced by different endpoint definitions
    var definitions = swaggerObject.definitions;

    // these are the different endpoint paths
    var pathsKeys = Object.keys(swaggerObject.paths);
    async.forEach(pathsKeys, function (pathKey, callback) {
      var path = swaggerObject.paths[pathKey];
      if ('get' in path) {
        var method = path.get;
        var finalPath = _replaceParams(pathKey, paramReplacementMap);
        supertest(url)
          .get(finalPath)
          .end(function (err, res) {
            assert.ifError(err, 'Error found when getting ' + finalPath + ': ' + err);

            var expectedResponseObject = method.responses[res.status];
            if (!expectedResponseObject) {
              console.warn('No specific response status code found for status code: ' + res.status + ' for ' + finalPath + '. Trying with default response if any...');
              expectedResponseObject = method.responses.default;
              assert(expectedResponseObject, 'A response definition should exist for response status code ' + res.status +  ' for ' + finalPath + '.');
            }
            var expectedResponseDefinitionObject;
            if ('$ref' in expectedResponseObject.schema) {
              expectedResponseDefinitionObject = definitions[expectedResponseObject.schema.$ref];
            }
            console.info('Testing Swagger definition \'' + method.description + '\' for request path: ' + finalPath);
            _validate(finalPath, res.body, expectedResponseDefinitionObject, definitions);
            callback();
          });
      } else {
        callback();
      }
    }, done);
  });
};
