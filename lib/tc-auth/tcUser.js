var config = require('config');
var routeHelper = require('../../lib/routeHelper');
var request = require('request');

/*
 {
 "id": 40015014,
 "handle": "indy_qa3",
 "full_name": "Neil Hastings",
 "avatar_url": "//www.gravatar.com/avatar/b56ee7ec472676dfda65dd62bde2ff3e"
 "perms": {
 "challengeApp": true
 }
 }
 */
exports.tcUser = function(req, res, next) {
  if (req.user) {
    request(config.get('app.tcUser'), function (error, response, body) {
      if (!error && response.statusCode === 200) {
        body = JSON.parse(body);

        req.tcUser = {
          id: body.uid,
          name: body.full_name,
          handle: body.handle,
          picture: body.avatar_url,
          perms: body.perms
        };
        next();
      }
      else {
        //TODO: handle error response from tc api
        routeHelper.addErrorMessage(req, 503, 'TC API Unavailable');
      }
    });
  } else {
    next();
  }
};

/**
 * Return the user currently singed in.
 * @param req the request
 */
exports.getSigninUser = function(req) {
  return req.tcUser ? req.tcUser : {};
};

exports.mockUser = function(req, res, next) {

  req.tcUser = {
    id: parseInt(req.headers['x-uid']) || 40015014,
    name: req.headers['x-name'] || 'Neil Hastings',
    handle: req.headers['x-handle'] || 'indy_qa3',
    picture: req.headers['x-picture'] || '//www.gravatar.com/avatar/b56ee7ec472676dfda65dd62bde2ff3e',
    perms: {
      challengeApp: true
    }
  };

  next();
};