
var config = require('config');
var _ = require('lodash');

/**
 * Authenticated paths for the application.
 * Configure authPaths in configuration settings
 * authPaths is an array of object. Each object has following structure
 *   {
 *     httpVerb: '<GET/POST/PUT/DELETE/PATCH>',
 *     path: '<SECURED ENDPOINT>'
 *   }
 *   For ex:
 *   {
 *     httpVerb: 'GET',
 *     path: '/challenges/:challengeId/files/:fileId/download'
 *   }
 *
 * @type {Array}
 */
var authPaths = config.get('auth.paths');
var routingMethods = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
  HEAD: 'head',
  OPTIONS: 'options'
};

/**
 *
 * @param app
 *  express app
 * @param mw
 * the auth middle ware to add to the path
 */
exports.checkPath = function(app, mw) {
  // adding auth handler for file download and upload ENDPOINTS defined in configuration settings
  if (_.isArray(authPaths)) {
    _.forEach(authPaths, function(authPath) {
      var verb = routingMethods[authPath.httpVerb];
      if (verb) {
        app[verb](authPath.path, mw);
      }
    });
  }
};