/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
'use strict';
var datasource = {};
var serenityDatasource = require('serenity-datasource');

/**
 * This function will initializes datasource with all the models present in models directory
 * @param {Object} config Global configuration object
 */
datasource.init = function(config) {
  if (!this.dbInstance) {
    this.dbInstance = new serenityDatasource(config);
  }
};

/**
 * Return the initialized datasource.
 * @return {Object} Datasource Object
 */
datasource.getDataSource = function() {
  return this.dbInstance;
};

/**
 * Exporting module
 */
module.exports = datasource;
