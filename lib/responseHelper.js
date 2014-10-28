'use strict';

/**
 * This library implements the google partial response pattern
 * The API response will be standard API response as defined in Appiro spec
 * 
 */

/**
 * Module dependencies
 */
var mask = require('json-mask'),
  async = require('async'),
  routeHelper = require('./routeHelper'),
  _ = require('lodash');


/**
 * Module exports
 * It will export a middleware function, which will be added before the response is send to client
 * The middleware will read the fields query parameter and transform the response accordingly.
 * For Ex:
 *       Consider a GET request for /challenges. It will return all challenges.
 *       Let the client only requests for following fields
 *       fields=id,title,overview
 *       Then the middleware will remove the excess fields from the response
 * 
 * @return {Function}           middleware function
 */
module.exports = function() {

  var middleware = function(req, res, next) {
    console.log('response helper middleware called');
    console.log(req.swagger);
    /**
     * If error, then call the next. routeHelper.js will handle the error
     */
    if(req.error) {
      return next();
    }
    var fields = req.swagger.params.fields.value;
    // if partial response is requested by client
    if(fields) {
      /**
       * Mask function
       * @param  {Object}       obj             object to mask
       * @param  {Function}     callback        callback function
       */
      var maskObject = function(obj, callback) {
        var maskedObj = mask(obj, fields);
        callback(null, maskedObj);
      };
      // check if data is not null or undefined and content is defined and is an array or object
      var partialResponse = req.data && req.data.content,
        content = req.data.content;
      if(partialResponse) {
        // if content is array. Apply the partial response to every item in array
        if(_.isArray(content)) {
          async.map(content, maskObject, function(err, masked) {
            if(err) {
              routeHelper.addError(req, err);
              // let the route helper handle the error.
              return next();
            }
            // add the masked response to req.data which will be send back to client by routeHelper
            req.data.content = masked;
            return next();
          });
        // the content is object apply the partial response to single  object
        } else if(_isObject(content)) {
          maskObject(content, function(err, masked) {
            if(err) {
              routeHelper.addError(req, err);
              // let the route helper handle the error.
              return next();
            }
            req.data.content = content;
            return next();
          });
        // else don't do anything
        } else {
          return next();
        }
      } else {
        return next();
      }
    }
    next();
  };
  return middleware;
};