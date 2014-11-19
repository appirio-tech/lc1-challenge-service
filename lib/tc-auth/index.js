var jwt = require('express-jwt');
var config = require('config');
var request = require('request');

module.exports = function(options) {
  if (!options.client) {
    throw new Error('Auth0 Client not configured. Set `TC_AUTH0_CLIENT` as an environment variable.');
  }

  if (!options.secret) {
    throw new Error('Auth0 Secret not configured. Set `TC_AUTH0_SECRET` as an environment variable.');
  }

  return jwt({
    secret: new Buffer(options.secret, 'base64'),
    audience: options.client
  });
};
