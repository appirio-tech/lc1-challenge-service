'use strict';

var datasource = {};
datasource.db = require('./server/models');

/**
 * This function will initializes datasource with all the models present in server/models directory
 * @param  {Object}   config         Global configuration object
 * @param  {Function} callback       Callback function
 */
datasource.init = function(config, callback) {
  this.db
  .sequelize
  .sync({force : true})
  .complete(callback);
};

/**
 * Return the initialized datasource.
 * @return {Object}         Datasource Object
 */
datasource.getDataSource = function() {
  return this.db;
};

/**
 * Exporting module
 */
module.exports = datasource;