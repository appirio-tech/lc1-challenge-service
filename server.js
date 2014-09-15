'use strict';
var loader = require('./loader'),
  express = require('express'),
  app = express();


/**
 * bootstraping the app
 */
loader.bootstrap(app, function(app, config) {

  /**
   * Create and Start the server
   */
  app.listen(config.port);
  console.log('Express server listening on port ' + config.port);
});