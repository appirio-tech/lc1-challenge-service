'use strict';

var a127 = require('a127-magic');
var express = require('express');
var app = express();
var config = require('config');
var datasource = require('./datasource');

// uncomment the following if you need to parse incoming form data
//app.use(express.bodyParser());

// @TODO add try/catch logic
datasource.init(config);

var port;
if (config.has('app.port')) {
  port = config.get('app.port');
} else {
  port = 10010;
}

app.use(a127.middleware());

app.listen(port);
