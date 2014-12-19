
var config = require('config');
var tcUser = require('./tcUser');
var _ = require('lodash');

exports.checkPerms = function(req, res, next) {
  if (!currentUserPass(req)) {
    // Remove user and tcUser This will cause requireAuth middleware to return
    // @TODO Later we might want to log this info so we shouldn't be deleting it
    delete req.user;
    delete req.tcUser;
  }

  next();
};

function getPerms() {
  var perms = [];
  if (config.has('auth.perms')) {
    perms = config.get('auth.perms');
  } else {
    perms = [
      'challengeApp'
    ];
  }

  // If from config and this is not an array then split on comma
  if (!_.isArray(perms)) {
    perms = perms.split(',');
  }

  return perms;
}

function currentUserPass(req) {
  var perms = getPerms();
  var user = tcUser.getSigninUser(req);

  _.forEach(perms, function(perm) {
    if (!user.perms[perm]) {
      return false;
    }
  });

  return true;
}

exports.getPerms = getPerms;
exports.currentUserPass = currentUserPass;