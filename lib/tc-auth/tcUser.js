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
    var options = {
      url: config.get('app.tcUser') + '/user',
      headers: {
        'Authorization': req.get('Authorization'),
        'x-id': req.get('x-id'),
        'x-full-name': req.get('x-full-name'),
        'x-handle': req.get('x-handle'),
        'x-avatar-url': req.get('x-avatar-url')
      }
    };

    console.log('auth call');
    console.log(options);

    request(options, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        body = JSON.parse(body);

        req.tcUser = {
          id: body.id,
          name: body.fullName,
          handle: body.handle,
          picture: body.avatarUrl,
          perms: body.perms
        };
        next();
      }
      else {
        //TODO: handle error response from tc api
        console.log('USER SERVICE ERROR');
        console.log(error);
        routeHelper.addErrorMessage(req, 503, 'TC API Unavailable');
        next();
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
    id: parseInt(req.headers['x-id']) || 40015014,
    name: req.headers['x-full-name'] || 'Neil Hastings',
    handle: req.headers['x-handle'] || 'indy_qa3',
    picture: req.headers['x-avatar-url'] || '//www.gravatar.com/avatar/b56ee7ec472676dfda65dd62bde2ff3e',
    perms: {
      challengeApp: true
    }
  };

  next();
};