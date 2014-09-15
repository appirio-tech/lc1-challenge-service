'use strict';

/**
 * Computing Application root path
 * @type {String}
 */
var path = require('path'),
  rootPath = path.normalize(__dirname + '/../..');

/**
 * Exporting module functions
 */
module.exports = {
  root: rootPath,
  port: process.env.PORT || 3000,
  hostname: process.env.HOST || process.env.HOSTNAME,
};