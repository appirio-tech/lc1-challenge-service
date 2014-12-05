var config = require('config');
var routeHelper = require('../../lib/routeHelper');

exports.tcUser = function(req, res, next) {
  if (req.user) {
    request(config.get('app.tcApi') + '/user/tcid/' + req.user.sub, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        body = JSON.parse(body);

        req.tcUser = {
          id: body.uid,
          name: req.user.name,
          handle: body.handle,
          picture: req.user.picture
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
    id: parseInt(req.headers['x-uid']) || 1,
    name: req.headers['x-name'] || 'Neil Hastings',
    handle: req.headers['x-handle'] || '_indy',
    picture: req.headers['x-picture'] || 'http://cdn1.appleinsider.com/code-131209.jpg'
  };

  next();
};
