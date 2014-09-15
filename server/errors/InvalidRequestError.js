'use strict';

/**
 * Invalid Response Error class
 * @param {String} code      Response code
 * @param {Object} error     Inner error
 */
function InvalidRequestError (code, error) {
  Error.call(this, error.message);
  this.name = 'InvalidRequestError';
  this.message = error.message;
  this.code = code;
  this.status = 400;
  this.inner = error;
}

InvalidRequestError.prototype = Object.create(Error.prototype);
InvalidRequestError.prototype.constructor = InvalidRequestError;

module.exports = InvalidRequestError;