'use strict';

var _ = require('lodash');


/**
 * Add Error object to request.
 * @param req the request
 * @param err the origianl Error
 * @param errCode the error code
 */
exports.addError = function(req, err, errCode) {
  req.error = {};

  if (err instanceof Array) {   // Sequelize returns array
    req.error.message = err[0].message;
  } else if (err.message) {
    req.error.message = err.message;
  } else if (err.errors && err.errors instanceof Array) {
    req.error.errors = err.errors;
  } else if (typeof err === 'string') {  // error from a127 middleware validation error
    req.error.message = err;
  } else {
    req.error.message = 'request failed';
  }
  req.error.code = errCode || 500;
  req.error.responseCode = errCode || 500;
};

/**
 * Add error name and message to request.
 * @param req the request
 * @param errMsg the error message
 * @param errCode the error code
 */
exports.addErrorMessage = function(req, errMsg, errCode) {
  req.error = {};
  req.error.message = errMsg;
  req.error.code = errCode || 500;
  req.error.responseCode = errCode || 500;
};

/**
 * Add validation error to request.
 * @param req the request
 * @param errMsg the error message
 * @param errCode the error code
 */
exports.addValidationError = function(req, errMsg, errCode) {
  if (!req.error) {
    req.error = {};
    req.error.code = 400;
    req.error.responseCode = 400;
  }
  if (!req.error.errors) {
    req.error.errors = [];
  }
  req.error.errors.push(new Error(errMsg));
};

/**
 * Return the user currently singed in.
 * @param req the request
 */
exports.getSigninUser = function(req) {
  // For now, just return hard-coded value.
  return '_indy';
};

/**
 * This method renders result (req.error or req.data) as JSON.
 * @param req the request
 * @param res the response
 */
exports.renderJson = function(req, res) {
  if (req.error) {
    if (req.error.errors) {
      res.status(400).json({
        code : req.error.code,
        message : _.pluck(_.values(req.error.errors), 'message').join(', ')
      });
    } else {
      res.status(req.error.responseCode).json({
        code : req.error.code,
        message : req.error.message
      });
    }
  } else if (req.data) {
    res.status(200).json(req.data);
  } else {
    res.status(404).json({
      code: '404',
      message: 'The resource is not found'
    });
  }
};

/**
 * Generic error handling middleware.
 * @param err the error
 * @param req the request
 * @param res the response
 * @param next the next
 */
exports.errorHandler = function(err, req, res, next) {
  if (err) {
    exports.addError(req, err, 400);
  }
  next();
}
