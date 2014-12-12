'use strict';

var config = require('config');
var pathToRegexp = require('path-to-regexp');
var _ = require('lodash');
var routeHelper = require('../../lib/routeHelper.js');

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
var pathOverrides = config.get('auth.pathOverrides');
var defaultAuth = config.get('auth.default');

/**
 * @param app
 *  express app
 * @param mw
 * the auth middle ware to add to the path
 */
exports.addAuth = function(app, mw) {
  app.all('*', mw);
};

function checkPermission(req, perms) {
  var denied = false;
  _.forEach(perms, function(requiredPerm) {
    if (!req.tcUser.perms[requiredPerm]) {
      denied = true;
    }
  });
  return denied;
}

exports.checkPath = function(req, res, next) {
  var overrided = false;
  var permissionDenied = false;
  _.forEach(pathOverrides, function(override) {
    var perms = override.perms || defaultAuth.perms;
    if (override.httpVerb === req.method) {
      if (override.path === '*') {
        overrided = true;
        if (override.enabled) {
          permissionDenied = checkPermission(req, perms);
        }
      } else {
        var keys = [];
        var reg = pathToRegexp(override.path, keys, {
          sensitive: true
        });
        if (reg.exec(req.path)) {
          overrided = true;
          if (override.enabled) {
            permissionDenied = checkPermission(req, perms);
          }
        }
      }
    }
  });
  if (!overrided && defaultAuth.enabled) {
    if (defaultAuth.enabled) {
      permissionDenied = checkPermission(req, defaultAuth.perms);
    }
  }
  if (permissionDenied) {
    routeHelper.addErrorMessage(req, 'Permission Deny', 403);
    routeHelper.renderJson(req, res);
  } else {
    next();
  }
};
