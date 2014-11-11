/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';

module.exports = function(config) {
  var fse = require('fs-extra');
  var path = require('path');
  var Sequelize = require('sequelize');
  var _ = require('lodash');

  // reading config.
  var postgresurl;

  // @TODO setup test heroku so we don't need this
  if (config.has('app.pgURLWercker')) {
    postgresurl = config.get('app.pgURLWercker');
  } else if (config.has('app.pgURL')) {
    postgresurl = config.get('app.pgURL');
  } else {
    postgresurl =  'postgres://' + config.get('app.pg.username') +
    ':' + config.get('app.pg.password') +
    '@' + config.get('app.pg.host') +
    ':' + config.get('app.pg.port') +
    '/' + config.get('app.pg.database');
  }

  var sequelize = new Sequelize(postgresurl);
  var db = {};

  // Add JSON and JSONB data type to Sequelize
  Sequelize.JSON = 'JSON';
  Sequelize.JSONB = 'JSONB';

  fse.readdirSync(__dirname).filter(function(file) {
    return ((file.indexOf('.' ) !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js'));
  }).forEach(function(file) {
    var model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

  Object.keys(db).forEach(function(modelName) {
    if (db[modelName].hasOwnProperty('associate')) {
      db[modelName].associate(db);
    }
  });
  return _.extend({sequelize: sequelize, Sequelize: Sequelize}, db);
};
