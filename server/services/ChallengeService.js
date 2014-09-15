'use strict';

var helper = require('./Helper');
var datasource = require('./../../datasource').getDataSource();
var Challenge = datasource.Challenge;
var Submission = datasource.Submission;
var Registrant = datasource.Registrant;

/** 
 * Fetches all challenges from DB according to passed searchCriteria
 * @param {Object}        searchCriteria        searchCriteria object
 * @param {Function}      callback              callback function
 */
exports.getAll = function(searchCriteria, callback) {
  var err = helper.checkFunction(callback, 'callback');
  if(err) {
    throw new Error('callback should be a function');
  }
  Challenge.findAll().success(function(challenges) {
    callback(null, challenges);
  }).error(function(err) {
    callback(err, null);
  });
};

exports.getSingle = function(id, callback) {
  var err = helper.checkFunction(callback, 'callback');
  if(err) {
    throw new Error('callback should be a function');
  }
  Challenge.find({ where: {id: id}, include: [Submission, Registrant] }).success(function(challenges) {
    callback(null, challenges);
  }).error(function(err) {
    callback(err, null);
  });
};

exports.createChallenge = function(challenge, callback) {
  var err = helper.checkFunction(callback, 'callback');
  if(err) {
    throw new Error('callback should be a function');
  }

  Challenge.create(challenge).success(function(challenge) {
    callback(null, challenge);
  }).error(function(err) {
    callback(err, null);
  });
};

exports.register = function(id, userId, callback) {
  var err = helper.checkFunction(callback, 'callback');
  if(err) {
    throw new Error('callback should be a function');
  }
  Challenge.find(id).success(function(challenge) {
    if(challenge) {
      challenge.createRegistrant({userId: userId}).success(function(result) {
        callback(null, result);
      }).error(function(err) {
        callback(err, null);
      });
    } else {
      callback(new Error('No challenge for id ' + id), null);
    }
  }).error(function(err) {
    callback(err, null);
  });
};

exports.submit = function(id, userId, filePath, callback) {
  var err = helper.checkFunction(callback, 'callback');
  if(err) {
    throw new Error('callback should be a function');
  }
  
  Challenge.find(id).success(function(challenge) {
    if(challenge) {
      challenge.createSubmission({userId : userId, filePath : filePath}).success(function(result) {
        callback(null, result);
      }).error(function(err) {
        callback(err, null);
      });
    } else {
      // challenge doesn't exist for given submission.
      // do something throw err
      callback(new Error('Challenge doesn\'t exist for id ' + id), null);
    }
  }).error(function(err){
    callback(err, null);
  }); 
};