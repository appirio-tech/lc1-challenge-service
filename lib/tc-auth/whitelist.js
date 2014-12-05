
var config = require('config');
var tcUser = require('./tcUser');
var _ = require('lodash');

exports.whitelist = function(req, res, next) {
  if (config.has('auth.whitelist.enabled') && config.get('auth.whitelist.enabled')) {
    var whiteListUsers;
    if (config.has('whitelist.users')) {
      whiteListUsers = config.get('auth.whitelist.users');
    } else {
      whiteListUsers = [
        'dayal',
        'rockabilly',
        'kbowerma',
        ' _indy',
        'appiriowes'
      ];
    }

    // If from config and this is not an array then split on comma
    if (!_.isArray(whiteListUsers)) {
      whiteListUsers = whiteListUsers.split(',');
    }

    if (!whiteListUsers.indexOf(tcUser.getSigninUser(req))) {
      // Remove user and tcUser This will cause requireAuth middleware to return
      // @TODO Later we might want to log this info so we shouldn't be deleting it
      delete req.user;
      delete req.tcUser;
    }
  }

  next();
};