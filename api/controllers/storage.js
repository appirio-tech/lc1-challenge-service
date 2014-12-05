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
var routeHelper = require('./../../lib/routeHelper');
var storageLib = require('./../../lib/storage');
var async = require('async');
var safeList = require('../../lib/tc-auth/safelist');


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
  var challengeId = req.swagger.params.challengeId.value,
    fileId = req.swagger.params.fileId.value,
    user = routeHelper.getSigninUser(req);

  async.waterfall([
    function(cb) {
      findById(Challenge, {where: {id:challengeId}}, cb);
    },
    function(challenge, cb) {
      if(!challenge) {
        return cb({message: 'Cannot find a challenge for challengeId ' + challengeId, code: routeHelper.HTTP_NOT_FOUND});
      }

      if (!safeList.currentUserIsSafe(req)) {
        challenge.getParticipants({where: {userId: user.id}}).success(function(participants) {
          cb(null, participants);
        }).error(function(err) {
          cb(err);
        });
      } else {
        cb(null, null);
      }

    },
    function(participants, cb) {
      if (!safeList.currentUserIsSafe(req)) {
        // participant will be an array, should not be empty array
        if (!participants || participants.length === 0) {
          return cb({message: 'User is not authorized', code: routeHelper.HTTP_UNAUTHORIZED});
        }
      }
      findById(File, {where: {id:fileId, challengeId: challengeId}}, cb);
    },
    function(file, cb) {
      if(!file) {
        return cb({message: 'Cannot find a file for fileId ' + fileId, code: routeHelper.HTTP_NOT_FOUND});
      }
      storageLib[method](file, cb);
    }
  ], function(err, result) {
    if(err) {
      routeHelper.addError(req, err, err.code);
    } else {
      var content = [];
      content.push({url: result});
      req.data = {
        success: true,
        status: routeHelper.HTTP_OK,
        metadata: {
          totalCount: 1
        },
        content: content
      };
    }
    next();
  });
};

var getSubmissionFileURL = function(method, req, res, next) {
  var challengeId = req.swagger.params.challengeId.value,
    submissionId = req.swagger.params.submissionId.value,
    user = routeHelper.getSigninUser(req),
    fileId = req.swagger.params.fileId.value;

  async.waterfall([
    function(cb) {
      findById(Challenge, {where: {id:challengeId}}, cb);
    },
    function(challenge, cb) {
      if(!challenge) {
        return cb({message: 'Cannot find a challenge for challengeId ' + challengeId, code: routeHelper.HTTP_NOT_FOUND});
      }

      if (!safeList.currentUserIsSafe(req)) {
        challenge.getSubmissions({where: {submitterId: user.id}}).success(function (submissions) {
          cb(null, submissions);
        }).error(function (err) {
          cb(err);
        });
      } else {
        cb(null, null);
      }
    },
    function(submissions, cb) {
      if (!safeList.currentUserIsSafe(req)) {
        if (!submissions || submissions.length === 0) {
          return cb({message: 'User is not authorized', code: routeHelper.HTTP_UNAUTHORIZED});
        }
      }
      findById(File, {where: {id:fileId, submissionId: submissionId}}, cb);
    },
    function(file, cb) {
      if(!file) {
        return cb({message: 'Cannot find a file for fileId ' + fileId, code: routeHelper.HTTP_NOT_FOUND});
      }
      storageLib[method](file, cb);
    }
  ], function(err, result) {
    if(err) {
      routeHelper.addError(req, err, err.code);
    } else {
      var content = [];
      content.push({url: result});
      req.data = {
        success: true,
        status: routeHelper.HTTP_OK,
        metadata: {
          totalCount: 1
        },
        content: content
      };
    }
    next();
  });
};

/**
 * This method return the file download URL for a challenge file.
 * It uses lib/storage to get the download URL based on the storage provider configuration
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
 * It uses lib/storage to get the download URL based on the storage provider configuration
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