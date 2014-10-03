'use strict';

var a127 = require('a127-magic');
var express = require('express');
var config = require('config');
var datasource = require('./datasource');
var routeHelper = require('./lib/routeHelper');

var app = express();

// uncomment the following if you need to parse incoming form data
app.use(bodyParser.json());

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
