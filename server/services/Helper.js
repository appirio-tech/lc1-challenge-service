'use strict';

/**
 * This is a helper class for all services
 */

var helper = {};
/**
* Checks whether given object is defined and function.
* @param {Object} obj - the type of object
* @param {String} objName - the object name
* @return created error or null
*/
helper.checkFunction = function (obj, objName) {
  if (typeof obj !== 'function') {
    return new Error(objName + ' should be function.');
  }
};

module.exports = helper;