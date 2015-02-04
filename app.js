/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

// New relic
if (process.env.NODE_ENV === 'production') {
  require('newrelic');
}

var a127 = require('a127-magic');
var express = require('express');
var config = require('config');
var datasource = require('./datasource');
var routeHelper = require('serenity-route-helper');
var resopnseHelper = require('serenity-partial-response-helper');
var partialResponseHelper = null;
var bodyParser = require('body-parser');
var auth = require('serenity-auth');
var errors = require('common-errors');
var morgan = require('morgan');
var winston = require('winston');

var app = express();

a127.init(function (swaggerConfig) {
  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(errors.middleware.crashProtector());

  // central point for all authentication
  auth.auth(app, config, auth.requireAuth);

  // Serve the Swagger documents and Swagger UI
  if (config.has('app.loadDoc') && config.get('app.loadDoc')) {
    var swaggerTools = require('swagger-tools');
    var swaggerUi = swaggerTools.middleware.v2.swaggerUi;
    var yaml = require('js-yaml');
    var fs = require('fs');

    var swaggerDoc = yaml.safeLoad(fs.readFileSync('./api/swagger/swagger.yaml', 'utf8'));
    app.use(swaggerUi(swaggerDoc));
  }

  /**
   * Serenity-datasource module standard configuration
   * This configuration is defined in global application configuration
   * which is exposed node config module
   * For more information about serenity-datasource module configuration
   * see module documentation
   */
  // @TODO add try/catch logic
  datasource.init(config);
  partialResponseHelper = new resopnseHelper(datasource);

  var port;
  if (config.has('app.port')) {
    port = config.get('app.port');
  } else {
    port = 10010;
  }

  app.use(partialResponseHelper.parseFields);

  // a127 middlewares
  app.use(a127.middleware(swaggerConfig));

  // Add logging
  app.use(function(err, req, res, next) {
    if (err) {
      winston.error(err.stack || JSON.stringify(err));
      routeHelper.middleware.errorHandler(err, req, res, next);
    } else {
      next();
    }
  });

  // render response data as JSON
  app.use(routeHelper.middleware.renderJson);

  app.listen(port);

  winston.info('Express server listening on port ' + port);
});

