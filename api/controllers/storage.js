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
 * @param  {Function}   callback    callback function
 * private
 */
var getChallengeFileURL = function(method, req, res, next) {
  // check authorization
  var challengeId = req.swagger.params.challengeId.value,
    fileId = req.swagger.params.fileId.value,
    user = routeHelper.getSigninUser(req);

  findById(Challenge, {where: {id:challengeId}}, function(err, challenge) {
    if(err) {
      routeHelper.addError(req, err);
      return next();
    }
    if(!challenge) {
      // if not able to find challenges with given id
      routeHelper.addErrorMessage(req, 'Cannot find a challenge for challengeId ' + challengeId, routeHelper.HTTP_NOT_FOUND);
      return next();
    }
    challenge.getParticipants({where: {userId: user.id}}).success(function(participants) {
      // participant will be an array, should not be empty array
      if(!participants || participants.length === 0) {
        // This user is not authorized to access the given resource. HTTP UNAUTHORIZED ERROR
        routeHelper.addErrorMessage(req, 'User is not authorized', routeHelper.HTTP_UNAUTHORIZED);
        return next();
      }
      /**
       * if participant is not null or undefined.
       * This user is a valid participant for the challenge process file request
       */
      findById(File, {where: {id:fileId, challengeId: challengeId}}, function(err, fileEntity) {
        if(err) {
          routeHelper.addError(req, err);
          return next();
        }
        if(!fileEntity) {
          // if not able to find file with given id
          routeHelper.addErrorMessage(req, 'Cannot find a challenge for challengeId ' + challengeId, routeHelper.HTTP_NOT_FOUND);
          return next();
        }
        storageLib[method](fileEntity, function(err, url) {
          if(err) {
            routeHelper.addError(req, err);
            return next();
          }
          var content = [];
          content.push({url: url});
          // total count will always be 1
          req.data = {
            success: true,
            status: routeHelper.HTTP_OK,
            metadata: {
              totalCount: 1
            },
            content: content
          };
          next();
        });
      });
    }).error(function(err) {
      routeHelper.addError(req, err);
      next();
    });
  });
};

var getSubmissionFileURL = function(method, req, res, next) {
  var challengeId = req.swagger.params.challengeId.value,
    submissionId = req.swagger.params.submissionId.value,
    user = routeHelper.getSigninUser(req),
    fileId = req.swagger.params.fileId.value;

  // check if challengeId is valid challenge id
  findById(Challenge,{where: {id: challengeId}}, function(err, challenge) {
    if(err) {
      routeHelper.addError(req, err);
      return next();
    }
    if(!challenge) {
      // if not able to find challenges with given id
      routeHelper.addErrorMessage(req, 'Cannot find a challenge for challengeId ' + challengeId, routeHelper.HTTP_NOT_FOUND);
      return next();
    }
    // check if the user has submissted to the challenge
    challenge.getSubmissions({where: {submitterId: user.id}}).success(function(submissions) {
      if(!submissions || submissions.length === 0) {
        // This user is not authorized to access the given resource. HTTP UNAUTHORIZED ERROR
        routeHelper.addErrorMessage(req, 'User is not authorized', routeHelper.HTTP_UNAUTHORIZED);
        return next();
      }
      /**
       * if submissions is not null or undefined.
       * This user has submitted to challenge
       * The returned submissions array will always have length 1
       */
      findById(File, {where: {id:fileId, submissionId: submissions[0].id}}, function(err, fileEntity) {
        if(err) {
          routeHelper.addError(req, err);
          return next();
        }
        if(!fileEntity) {
          // if not able to find file with given id
          routeHelper.addErrorMessage(req, 'Cannot find a submission file for submissionId ' + submissionId, routeHelper.HTTP_NOT_FOUND);
          return next();
        }
        storageLib[method](fileEntity, function(err, url) {
          if(err) {
            routeHelper.addError(req, err);
            return next();
          }
          var content = [];
          content.push({url: url});
          // total count will always be 1
          req.data = {
            success: true,
            status: routeHelper.HTTP_OK,
            metadata: {
              totalCount: 1
            },
            content: content
          };
          next();
        });
      });
    }).error(function(err) {
      routeHelper.addError(req, err);
      next();
    });
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