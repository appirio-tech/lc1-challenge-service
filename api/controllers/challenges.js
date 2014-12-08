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
var controllerHelper = require('./../../lib/controllerHelper');



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
  submit: submissionController.create,
  getSubmission: submissionController.get,
  updateSubmission: submissionController.update,
  removeSubmission: submissionController.delete
};
