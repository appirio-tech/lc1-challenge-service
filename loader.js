'use strict';

/**
 * Global module variables
 */
var fs = require('fs'),
  _ = require('lodash'),
  express = require('express'),
  bodyParser = require('body-parser'),
  datasource = require('./datasource'),
  LocalUploadMiddleware = require('./server/middleware/LocalUploadMiddleware'),
  S3UploadMiddleware = require('./server/middleware/S3UploadMiddleware');

/**
 * Will load the configuration form config/env/<NODE_ENV>
 * This is following the same pattern as MEAN stack
 * @return {Object}       Global configuration object
 */
var loadConfig = function() {
  // Load configurations
  // Set the node environment variable if not set before
  var configPath = process.cwd() + '/config/env';
  process.env.NODE_ENV = !fs.readdirSync(configPath).map(function(file) {
    return file.slice(0, -3);
  }).indexOf(process.env.NODE_ENV) ? process.env.NODE_ENV : 'development';

  // Extend the base configuration in all.js with environment
  // specific configuration
  return _.extend(
    require(configPath + '/all'),
    require(configPath + '/' + process.env.NODE_ENV) || {}
  );
};

/**
 * Load the routes from config.routes
 * @param  {Object}  app           Express Application
 * @param  {Object}  config        Global configuration Object
 * @param  {Object}  controllers   Object of controllers
 */
var loadRoutes = function(app, config, controllers) {
  var routingMethods, route, routeValues, routeKeys, verb,
    path, controllerName, actionName, actionMethod;
  //load and initialize the routes
  routingMethods = {
    GET: 'get',
    POST: 'post',
    PUT: 'put',
    DELETE: 'delete',
    HEAD: 'head',
    OPTIONS: 'options'
  };
  for (route in config.routes) {
    if (config.routes.hasOwnProperty(route)) {
      routeValues = config.routes[route].split('#');
      if (routeValues.length !== 2) {
        throw new Error('ERROR Route value "' + config.routes[route] +
          '" Route value must be "<controller-name>#<action-method-name>",' +
          ' like "foo#index"');
      }

      routeKeys = route.split(' ');
      if (routeKeys.length !== 2) {
        throw new Error('ERROR Route key "' + route +
          '" Route key must be "<HTTP-verb> <path-pattern>", like "GET /foo/:id"');
      }

      verb = routeKeys[0];
      path = routeKeys[1];
      controllerName = routeValues[0];
      actionName = routeValues[1];
      if (!routingMethods[verb]) {
        throw new Error('HTTP verb "' + verb + '" for route "' + route + '" is not supported!');
      }

      if (!controllers[controllerName]) {
        throw new Error('Controller "' + controllerName + '" is not available for route "' + route + '"!');
      }

      actionMethod = controllers[controllerName][actionName];
        if (!actionMethod) {
          throw new Error('Action method "' + controllerName + '#' +
            actionName + '" is not available for route "' + route + '"!');
      }
      app[routingMethods[verb]](path, controllers[controllerName][actionName]);
    }
  }
};

/**
 * Loads the controllers from config.controllers
 * @param  {Object}     config        Global configuration
 * @return {Object}     controllers   controllers object with initialized controllers
 */
var loadControllers = function(config) {
  var options, controller, controllerConfig, controllerBunch, controllers = {};
  for (controller in config.controllers) {
    if (config.controllers.hasOwnProperty(controller)) {
      controllerConfig = config.controllers[controller];
      options = controllerConfig.options;
      if(options && typeof (options) !== 'object') {
        throw new Error('Controller ' + controller + 'options should be a object');
      }
      var controllerPath = './server/controllers/' + controller;
      controllerBunch = require(controllerPath);
      controllerBunch.init(options, config);
      controllers[controller] = controllerBunch;
    }
  }
  return controllers;
};

/**
 * Load the middlewares
 * Depending on the configuration it will either load LocalUploadMiddleware or S3UploadMiddleware
 * This configuration has to be defined in global configuration
 * 
 * @param  {[type]}   router     app router Object
 * @param  {[type]}   app        express app object
 * @param  {[type]}   config     Global configuration object
 */
var middlewares = function(router, app, config) {
  /**
   * configuring file uploads
   */
  var uploadOptions = config.uploads;
  var uploadMiddleware;
  if(uploadOptions.isLocalStorage) {
    /**
     * Local storage is configured. Initializing local upload middleware
     */
    uploadMiddleware = new LocalUploadMiddleware(config);
  } else {
    /**
     * Local storage is not configured. Default storage option would be Amazon s3 service
     * Initializing amazon s3 middleware
     */
    uploadMiddleware = new S3UploadMiddleware(config);
  }
  // The submission path is hard coded for now
  router.use('/challenges/:id/submit', uploadMiddleware);
  /**
   * configure app to use body parser
   * All the middlewares can be configured here
   * Don't use body parser for file uploads. File upload will be handled by formidable 
   */
  router.use(bodyParser.urlencoded({ extended: true }));
  router.use(bodyParser.json());
  app.use('/', router);
};

/**
 * Exposing only config function for loading config during test
 * @return {Object}         Global configuration object
 */
module.exports.getConfig = function() {
  return loadConfig();
};

/**
 * This function will bootstrap the app.
 * @param  {Object}       app           express application
 * @param  {Function}     callback      callback function
 */
module.exports.bootstrap = function(app, callback) {
  var router = express.Router();

  // connecting to database and loading all models
  var config = loadConfig();
  // configure and loading middlewares
  middlewares(router, app, config);
  // load controllers
  var controllers = loadControllers(config);

  // loading routes
  loadRoutes(app, config, controllers);

  // connecting to database
  datasource.init(config, function(err) {
    if(err) {
      throw err[0];
    }
    // application successfully initialized
    callback(app, config);
  });
};