
var config = require('config');
var jwtCheck = require('./jwtCheck');
var checkPaths = require('./checkPath');
var tcUser = require('./tcUser');

// @TODO remove this dependency
var routeHelper = require('../../lib/routeHelper');

exports.auth = function(app) {
  var authEnabled = false;

  if (config.has('auth.enabled')) {
    authEnabled = config.get('auth.enabled');
  } else if (config.has('app.disableAuth')) {
    // Support legacy app.disableAuth
    authEnabled = !config.get('app.disableAuth');
  }

  // First check if auth is enabled
  if (authEnabled) {
    // Add the jwt middleware to the paths
    checkPaths.checkPath(app,
      [jwtCheck.jwtCheck(config.get('auth0')), tcUser.tcUser, routeHelper.requireAuth]);
  } else {
    // fake auth
    app.use(tcUser.mockUser);
  }
};