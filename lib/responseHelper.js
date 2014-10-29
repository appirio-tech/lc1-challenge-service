'use strict';

/**
 * This library implements the google partial response pattern
 * The API response will be standard API response as defined in swagger.yaml
 */

/**
 * Module dependencies
 */
var mask = require('json-mask'),
  compile = mask.compile,
  async = require('async'),
  routeHelper = require('./routeHelper'),
  _ = require('lodash');

/**
 * This function validates the query fields parameter.
 * The fields that are requested by the client should be valid field
 * i.e, the field name property should exist in the resource
 *
 * @param  {Object}   obj               object/array to check(validate)
 * @param  {String}   fields            comma seperated list of fields as in request query parameter
 * @param  {Function} callback          callback function
 */
var _checkFields = function(obj, fields, callback) {
  var compiledMask = compile(fields);
  if(_.isArray(obj)) {

  } else if(_.isObject(obj)) {
    _.keys(compiledMask).map(function(key) {
      if(!_.has(obj, key)) {
        callback(new Error(), null);
      }
    });
  }
};

/**
 * Mask function
 * @param  {Object}       obj             object/array to mask
 * @param  {Function}     callback        callback function
 * @private
 */
var _maskObject = function(obj, callback) {
  var maskedObj = mask(obj, fields);
  callback(null, maskedObject);
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
            function(validatedContent, callback) {
              _maskObj(validatedContent, callback);
            }
          ], function(err, masked) {
            if(err) {
              routeHelper.addError(req, err);
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