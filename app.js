/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

var a127 = require('a127-magic');
var express = require('express');
var config = require('config');
var datasource = require('./datasource');
var routeHelper = require('./lib/routeHelper');
var bodyParser = require('body-parser');

var app = express();

// uncomment the following if you need to parse incoming form data
app.use(bodyParser.json());


// Serve the Swagger documents and Swagger UI
if (config.has('app.loadDoc') && config.get('app.loadDoc')) {
  var swaggerTools = require('swagger-tools');
  var swaggerUi = swaggerTools.middleware.v2.swaggerUi;
  var yaml = require('js-yaml');
  var fs = require('fs');

  var swaggerDoc = yaml.safeLoad(fs.readFileSync('./api/swagger/swagger.yaml', 'utf8'));
  app.use(swaggerUi(swaggerDoc));
}


// @TODO add try/catch logic
datasource.init(config);

var port;
if (config.has('app.port')) {
  port = config.get('app.port');
} else {
  port = 10010;
}

// a127 middlewares
app.use(a127.middleware());
// generic error handler
app.use(routeHelper.errorHandler);
// render response data as JSON
app.use(routeHelper.renderJson);

app.listen(port);

console.log('app started at ' + port);
