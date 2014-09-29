'use strict';

module.exports = function(config) {
  var fse = require('fs-extra');
  var path = require('path');
  var Sequelize = require('sequelize');
  var _ = require('lodash');

  // reading config.
  var postgresurl = config.get('app.pgURL') ||
    (config.get('app.pg.dialect') +'://' +
    config.get('app.pg.username') + ':' +
    config.get('app.pg.password') + '@' +
    config.get('app.pg.host') + ':' +
    config.get('app.pg.port') + '/' +
    config.get('app.pg.database'));

  var sequelize = new Sequelize(postgresurl, config.pg);
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
    if (db[modelName].options.hasOwnProperty('associate')) {
      db[modelName].options.associate(db);
    }
  });
  return _.extend({sequelize: sequelize, Sequelize: Sequelize}, db);
};
