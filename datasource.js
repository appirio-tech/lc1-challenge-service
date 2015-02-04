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
    // If pgURLWercker exists then use that instead of pgurl
    var dbConfig;
    if (config.has('datasource.pgURLWercker')) {
      dbConfig = {
        datasource: {
          modelsDirectory: config.get('datasource.modelsDirectory'),
          pgURL: config.get('datasource.pgURLWercker')
        }
      };
    } else {
      dbConfig = config;
    }

    this.dbInstance = new serenityDatasource(dbConfig);
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
