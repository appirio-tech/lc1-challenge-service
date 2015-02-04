/**
 * This controller provides methods to get download, upload URL for a challenge file or submission file
 *
 * @version 1.0
 * @author spanhawk
 */
'use strict';

var datasource = require('./../../datasource').getDataSource();
var Challenge = datasource.Challenge;
var File = datasource.File;
var async = require('async');
var auth = require('serenity-auth');
var config = require('config');
var storageLib = require('serenity-storage')(config);
var errors = require('common-errors');

/**
 * Helper method to find an entity by entity id property
 * @param  {Model}      Model       Sequelize Model
 * @param  {Object}     filters     filter criteria
 * @param  {Function}   callback    callback function
 * private
 */
var findById = function(Model, filters, callback) {
  Model.find(filters).success(function(entity) {
    callback(null, entity);
  }).error(function(err) {
    callback(err, null);
  });
};

/**
 * Helper method to get challenge file URL based on type
 * @param  {String}     method      Indicates the type of request to process
 * @param  {Model}      Model       Sequelize Model
 * @param  {Number}     id          id value
 * @param  {Function}   next        callback function
 * private
 */
var getChallengeFileURL = function(method, req, res, next) {
  // check authorization
  var challengeId = req.swagger.params.challengeId.value;
  var fileId = req.swagger.params.fileId.value;
  var user = auth.getSigninUser(req);
  var currentUserIsAdmin = auth.currentUserPass(req);

  if (user) {
    if (currentUserIsAdmin) {
      async.waterfall([
        function(cb) {
          findById(Challenge, {where: {id:challengeId}}, cb);
        },
        function(challenge, cb) {
          if (!challenge) {
            return cb(new errors.NotFoundError('challenge'));
          }

          findById(File, {where: {id:fileId, challengeId: challengeId}}, cb);
        },
        function(file, cb) {
          if(!file) {
            return cb(new errors.NotFoundError('file'));
          }
          storageLib[method](file, cb);
        }
      ], function(err, result) {
          if (err) {
            return next(err);  // go to error handler
          } else {
            req.data = {
              success: true,
              status: 200,
              metadata: {
                totalCount: 1
              },
              content: {url: result}
            };
          }
          next();
        }
      );
    } else {
      async.waterfall([
        function(cb) {
          findById(Challenge, {where: {id:challengeId}}, cb);
        },
        function(challenge, cb) {
          if(!challenge) {
            return cb(new errors.NotFoundError('challenge'));
          }

          challenge.getParticipants({where: {userId: user.id}}).success(function(participants) {
            cb(null, participants);
          }).error(function(err) {
            cb(err);
          });

        },
        function(participants, cb) {
          // participant will be an array, should not be empty array
          if (!currentUserIsAdmin && (!participants || participants.length === 0)) {
            return cb(new errors.NotPermittedError('User is not a Participant'));
          }
          findById(File, {where: {id:fileId, challengeId: challengeId}}, cb);
        },
        function(file, cb) {
          if(!file) {
            return cb(new errors.NotFoundError('file'));
          }
          storageLib[method](file, cb);
        }
      ], function(err, result) {
        if (err) {
          return next(err);  // go to error handler
        } else {
          req.data = {
            success: true,
            status: 200,
            metadata: {
              totalCount: 1
            },
            content: {url: result}
          };
        }

        next();
      });
    }

  } else {
    next(new errors.AuthenticationRequiredError('Authentication Required'));
  }
};

var getSubmissionFileURL = function(method, req, res, next) {
  var challengeId = req.swagger.params.challengeId.value;
  var submissionId = req.swagger.params.submissionId.value;
  var user = auth.getSigninUser(req);
  var fileId = req.swagger.params.fileId.value;
  var currentUserIsAdmin = auth.currentUserPass(req);

  if (user) {
    if (currentUserIsAdmin) {
      async.waterfall([
          function(cb) {
            findById(Challenge, {where: {id:challengeId}}, cb);
          },
          function(challenge, cb) {
            if (!challenge) {
              return cb(new errors.NotFoundError('challenge'));
            }

            findById(File, {where: {id:fileId, submissionId: submissionId}}, cb);
          },
          function (file, cb) {
            if (!file) {
              return cb(new errors.NotFoundError('file'));
            }
            storageLib[method](file, cb);
          }
        ], function (err, result) {
          if (err) {
            return next(err);  // go to error handler
          } else {
            req.data = {
              success: true,
              status: 200,
              metadata: {
                totalCount: 1
              },
              content: {url: result}
            };
          }
          next();
        }
      );
    } else {
      async.waterfall([
        function(cb) {
          findById(Challenge, {where: {id:challengeId}}, cb);
        },
        function(challenge, cb) {
          if(!challenge) {
            return cb(new errors.NotFoundError('challenge'));
          }

          challenge.getSubmissions({where: {submitterId: user.id}}).success(function (submissions) {
            cb(null, submissions);
          }).error(function (err) {
            cb(err);
          });
        },
        function(submissions, cb) {
          if (!currentUserIsAdmin && (!submissions || submissions.length === 0)) {
            return cb(new errors.NotPermittedError('User is not authorized'));
          }
          findById(File, {where: {id:fileId, submissionId: submissionId}}, cb);
        },
        function(file, cb) {
          if(!file) {
            return cb(new errors.NotFoundError('file'));
          }
          storageLib[method](file, cb);
        }
      ], function(err, result) {
        if(err) {
          return next(err);  // go to error handler
        } else {
          req.data = {
            success: true,
            status: 200,
            metadata: {
              totalCount: 1
            },
            content: {url: result}
          };
        }
        next();
      });
    }
  } else {
    next(new errors.AuthenticationRequiredError('Authentication Required'));
  }
};

/**
 * This method return the file download URL for a challenge file.
 * It uses serenity-storage module to get the download URL based on the storage provider configuration
 * Only participants can download the files
 *
 * @param  {Object}     req       Express request instance
 * @param  {Object}     res       Express response instance
 * @param  {Function}   next      Next function
 */
exports.getChallengeFileDownloadURL = function(req, res, next) {
  getChallengeFileURL('getDownloadUrl', req, res, next);
};

/**
 * This method return the file upload URL for a challenge file.
 * Only the participants can upload the file
 *
 * @param  {Object}     req       Express request instance
 * @param  {Object}     res       Express response instance
 * @param  {Function}   next      Next function
 */
exports.getChallengeFileUploadURL = function(req, res, next) {
  getChallengeFileURL('getUploadUrl', req, res, next);
};

/**
 * This method return the file download URL for a submission file.
 * It uses serenity-storage module to get the download URL based on the storage provider configuration
 * Only the person who submitted the file can download the file
 *
 * @param  {Object}     req       Express request instance
 * @param  {Object}     res       Express response instance
 * @param  {Function}   next      Next function
 */
exports.getSubmissionFileDownloadURL = function(req, res, next) {
  getSubmissionFileURL('getDownloadUrl', req, res, next);
};

/**
 * This method return the file upload URL for a submission file.
 *
 * @param  {Object}     req       Express request instance
 * @param  {Object}     res       Express response instance
 * @param  {Function}   next      Next function
 */
exports.getSubmissionFileUploadURL = function(req, res, next) {
  getSubmissionFileURL('getUploadUrl', req, res, next);
};