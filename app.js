'use strict';

var a127 = require('a127-magic');
//var express = require('express');
//var app = express();
//var config = require('config');
//var datasource = require('./datasource');

var swaggerTools = require('swagger-tools');

// uncomment the following if you need to parse incoming form data
//app.use(express.bodyParser());

// @TODO add try/catch logic
//datasource.init(config);


var a127Config = a127.config.load();
var a127Magic = a127Config['a127.magic'];
var result = swaggerTools.specs.v2.validate(a127Magic.swaggerObject);

if (typeof result !== 'undefined') {
  if (result.errors.length > 0) {
    console.log('The server could not start due to invalid Swagger document...');

    console.log('');

    console.log('Errors');
    console.log('------');

    result.errors.forEach(function (err) {
      console.log('#/' + err.path.join('/') + ': ' + err.message);
    });

    console.log('');
  }

  if (result.warnings.length > 0) {
    console.log('Warnings');
    console.log('--------');

    result.warnings.forEach(function (warn) {
      console.log('#/' + warn.path.join('/') + ': ' + warn.message);
    });
  }

  if (result.errors.length > 0) {
    process.exit(1);
  }
}


//app.use(a127.middleware());

//app.listen(port);
