'use strict';

var loader = require('../loader'),
  dataSource,
  config;


var init = function(callback) {
  dataSource = require('../datasource');
  config = loader.getConfig();
  dataSource.init(config, function() {
    console.log('APP DB INITIALIZED SUCCESSFULLY');
    callback();
  });
};


var getConfig = function() {
  return config;
};

var getDataSource = function() {
  return dataSource;
};

module.exports = {
  init : init,
  getConfig : getConfig,
  getDataSource : getDataSource
};