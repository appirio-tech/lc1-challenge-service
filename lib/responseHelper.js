'use strict';

/**
 * This library implements the google partial response pattern
 * For more info, visit:
 *   https://docs.google.com/a/appirio.com/presentation/d/15pucEI0MHj9y778EyaAWGh4MBH-I73i1-GS0ir7FhxE/edit#slide=id.g29c3ffcc3_064
 * The API response will be standard API response as defined in swagger.yaml
 *
 * @version   1.0
 * @author    spanhawk
 */

/**
 * Module dependencies
 */
var mask = require('json-mask'),
  compile = mask.compile,
  async = require('async'),
  routeHelper = require('./routeHelper'),
  // HTTP BAD REQUEST STATUS CODE
  HTTP_BAD_REQUEST = 400,
  _ = require('lodash');

/**
 * This function validates the query fields parameter.
 * The fields that are requested by the client should be valid field
 * i.e, the field name property should exist in the resource
 *
 * @param  {Object}   content           object/array to check(validate)
 * @param  {String}   fields            comma seperated list of fields as in request query parameter
 * @param  {Function} callback          callback function
 */
var _checkFields = function(content, fields, callback) {
  /**
   * If the content is an array then validate any single entity of an array
   * This will have performance improvement and it is based on the logic that
   * every single object in an array will have the exact same structure.
   */
  var obj = _.isArray(content) ? content[0] : content;
  // compile the fields
  var compiledMask = compile(fields), value, err;

  for(var key in compiledMask) {
    if(!_.has(compiledMask, key)) {
      continue;
    }
    value = obj[key];
    // value is undefined key field is not a valid field
    if(value === undefined) {
      err = {
        message: key + ' is not a valid field name',
        code: HTTP_BAD_REQUEST
      };
      // break the loop
      break;
    }
  }

  if(err) {
    return callback(err, null);
  }
  callback(null, content);
};

/**
 * Mask function
 *
 * @param  {Object}       obj             object/array to mask
 * @param  {Function}     callback        callback function
 * @private
 */
var _maskObject = function(obj, fields, callback) {
  var maskedObj = mask(obj, fields);
  callback(null, maskedObj);
};


/**
 * Module exports
 * It will export a middleware function, which will be added before the response is send to client
 * The middleware will read the fields query parameter and transform the response accordingly.
 * For Ex:
 *   Consider a GET request for /challenges. It will return all challenges.
 *   Let the client only requests for following fields
 *   fields=id,title,overview
 *   Then the middleware will remove the excess fields from the response
 * 
 * @return {Function}           middleware function
 */
module.exports = function() {

  var middleware = function(req, res, next) {
    /**
     * If error, then call the next. routeHelper.js will handle the error
     */
    if(req.error) {
      return next();
    }
    // if fields query parameter is defined
    var defined = req.swagger && req.swagger.params.fields;
    // if partial response is requested by client
    if(defined) {
      var fields = req.swagger.params.fields.value;
      // check if data is not null or undefined and content is defined and is an array or object
      var partialResponse = req.data && req.data.content,
        content = req.data.content;
      if(partialResponse) {
        // if content is array. Apply the partial response to every item in array
        if(_.isArray(content) || _.isObject(content)) {
          async.waterfall([
            function(callback) {
              _checkFields(content, fields, callback);
            },
            function(checkedContent, callback) {
              _maskObject(checkedContent, fields, callback);
            }
          ], function(err, masked) {
            if(err) {
              routeHelper.addError(req, err, err.code);
              // let the route helper handle the error.
              return next();
            }
            req.data.content = masked;
            next();
          });
        // else don't do anything
        } else {
          next();
        }
      } else {
        next();
      }
    } else {
      next();
    }
  };
  return middleware;
};