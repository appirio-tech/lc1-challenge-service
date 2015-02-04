/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
/**
 * This controller provides methods to access Challenge, File, Participant and Submission.
 *
 * @version 1.0
 * @author peakpado
 */
'use strict';


var datasource = require('./../../datasource').getDataSource();
var Challenge = datasource.Challenge;
var File = datasource.File;
var Participant = datasource.Participant;
var Submission = datasource.Submission;
var serenityControllerHelper = require('serenity-controller-helper');
var config = require('config');
var controllerHelper = new serenityControllerHelper(config);
var routeHelper = require('serenity-route-helper');
var auth = require('serenity-auth');
var errors = require('common-errors');

var challengeControllerOptions = {
  filtering: true,
  deletionRestrictions: {
    where: {
      status: 'DRAFT'
    }
  }
};

// build controller for challenge resource
var challengeController = controllerHelper.buildController(Challenge, null, challengeControllerOptions);


var filteringOff = {
  filtering: false
};
var fileControllerOptions = {
  customFilters : {
    where : {
      submissionId: null
    }
  },
  filtering: false
};

// build controller for the nested files resource
var fileController = controllerHelper.buildController(File, [Challenge], fileControllerOptions);

// build controller for the nested participants resource
var participantController = controllerHelper.buildController(Participant, [Challenge], {filtering: true});

// build controller for the nested submissions resource
var submissionController = controllerHelper.buildController(Submission, [Challenge], filteringOff);

module.exports = {
  getAll: challengeController.all,
  create: challengeController.create,
  getByChallengeId: challengeController.get,
  update: challengeController.update,
  delete: challengeController.delete,

  getChallengeFiles: fileController.all,
  addChallengeFile: fileController.create,
  getChallengeFile: fileController.get,
  updateChallengeFile: fileController.update,
  deleteChallengeFile: fileController.delete,

  getAllParticipants: participantController.all,
  addParticipant: participantController.create,
  getParticipant: participantController.get,
  updateParticipant: participantController.update,
  removeParticipant: participantController.delete,

  getSubmissions: submissionController.all,
  createSubmission: submissionController.create,
  getSubmission: submissionController.get,
  updateSubmission: submissionController.update,
  removeSubmission: submissionController.delete,

  register: function(req, res, next) {
    Participant.findOrCreate({
        userId: auth.getSigninUser(req).id,
        userHandle: auth.getSigninUser(req).handle,
        role: 'SUBMITTER',
        createdBy: auth.getSigninUser(req).id,
        updatedBy: auth.getSigninUser(req).id,
        challengeId: req.swagger.params.challengeId.value
      })
      .success(function(participant, created) {
        if (created) {
          req.data = {
            id: participant.id,
            result: {
              success: true,
              status: 200
            }
          };
        } else {
          next(new errors.ValidationError('User is already registered for the challenge.'));
        }
        next();
      })
      .error(function(err) {
        next(new errors.Error("Error", err));
      });
  }
};
