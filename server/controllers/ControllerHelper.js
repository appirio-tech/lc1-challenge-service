'use strict';

var controllerHelper = {};


/**
 * Define 400 http code
 */
controllerHelper.HTTP_BAD_REQUEST = 400;

/**
 * Define 404 http code
 */
controllerHelper.HTTP_NOT_FOUND = 404;

/**
 * Define 500 http code
 */
controllerHelper.HTTP_SERVER_ERROR = 500;

/**
 * Define 200 http code
 */
controllerHelper.HTTP_OK = 200;

/**
 * Define 204 http code
 */
controllerHelper.HTTP_NO_CONTENT = 204;

/**
 * Global handler for incoming HTTP request check
 * @param  {Object}    res    response object
 * @param  {Object}    err    err object
 */
controllerHelper.checkRequest = function(res, err) {
  if(err) {
    res.status(this.HTTP_BAD_REQUEST).send(err);
  }
};

/**
 * Will check if obj is undefined
 * @param  {Object}   obj         Object to validate
 * @param  {String}   objName     Object name
 * @return {Error}    err         Return error if obj is undefined
 */
controllerHelper.checkDefined = function(obj, objName) {
  if(typeof obj === 'undefined' || obj === null) {
    return new Error(objName + ' is undefined or null');
  }
};

/**
 * Will check if obj is of type object
 * @param  {Object}   obj         Object to validate
 * @param  {String}   objName     Object name
 * @return {Error}    err         Return error if obj is not object or empty object
 */
controllerHelper.checkObject = function(obj, objName) {
  return this.checkDefined(obj) || Object.keys(obj).length ===0;
};


/**
 * Will check if obj is of type array
 * @param  {Object}   obj         Object to validate
 * @param  {String}   objName     Object name
 * @return {Error}    err         Return error if obj is not array
 */
controllerHelper.isArray = function(obj, objName) {
  var err = this.checkDefined(obj);
  if(err) {
    return false;
  }
  return Object.prototype.toString.call(obj) === '[object Array]';
};

/**
 * Convert value into Number representation
 * @param  {String}   value         value to convert
 * @param  {String}   valueName     Name of value property
 * @return {Error}    err         Return error if obj is not array
 */
controllerHelper.getNumber = function(value, valueName) {
  return Number(value);
};


/**
 * Check if given value is a valid Number
 * @param  {Object}   value         value to convert
 * @param  {String}   valueName     Name of value property
 * @return {Error}    err           Return error if obj is not array
 */
controllerHelper.checkNumber = function(value, name) {
  var err = this.checkDefined(value);
  var val =  Number(value);
  if(isNaN(val)) {
    return err || new Error(name + 'should be a valid number');
  }
};

/**
 * Global handler for sending response back to client
 * If err is of type InvalidRequestError proxies response through checkRequest method
 * @param  {Object}     err           err object
 * @param  {Object}     result        result to send to client
 * @param  {Object}     req            Request Object
 * @param  {Object}     res            Response Object
 */
controllerHelper.sendResponse = function(err, result, req, res) {
  if(err) {
    if(err.name ==='InvalidRequestError') {
      /**
       * Invlid request error. Redirecting to invalid request handler
       */
      this.checkRequest(res, err);
      return;
    }
    res.status(this.HTTP_SERVER_ERROR).send();
    return;
  }
  if(this.checkDefined(result)) {
    res.status(this.HTTP_NO_CONTENT).send();
    return;
  }
  res.status(this.HTTP_OK).send(result);
};

/**
 * Check input is valid date long value.
 * @param value
 * @return {Boolean}
 */
controllerHelper.isValidDateValue = function (value) {
  return !this.checkDefined(value) || !isNaN(new Date(Number(value)).getTime());
};

/**
 * Get date object from input.
 * @param {String}value the long value String.
 * @return undefined if no input otherwise return match date.
 */
controllerHelper.getDate = function (value) {
  var date;
  if (!this.checkDefined(value)) {
    date =  new Date(Number(value));
  }
  return date;
};

module.exports = controllerHelper;