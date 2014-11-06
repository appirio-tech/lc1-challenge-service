'use strict';

var exports = module.exports = {};

/**
 * Sample request data
 */

exports.challengeData = {
  title: 'Serenity Challenge',
  status: 'SUBMISSION',
  account: 'account',
  accountId: '12ASD',
  prizes: [500.00, 250.00],
  regStartAt: '2014-10-09'
};

exports.challengeFileData = {
  title: 'File Title',
  filePath: '/uploads',
  size: 123,
  fileName: 'my-submission.zip',
  storageLocation: 'local',
  challengeId: 111
};

exports.participantData = {
  role: 'submitter',
  challengeId: 111,
  userId: 222
};

exports.requirementData = {
  requirementText: 'Need deployment guide',
  challengeId: 111
};

exports.scorecardData = {
  scoreSum: 97,
  scorePercent: 96.5,
  scoreMax: 99.9,
  status: 'VALID',
  pay: false,
  place: 1,
  prize: 1500,
  challengeId: 111,
  reviewerId: 222,
  submissionId: 333
};

exports.scorecardItemData = {
  score: 98,
  scorecardId: 111,
  requirementId: 222,
  comment: 'excellent job'
};

exports.submissionData = {
  challengeId: 111,
  submitterId: 222
};

exports.submissionFileData = {
  title: 'File Title',
  filePath: '/uploads',
  size: 123,
  fileName: 'my-submission.zip',
  storageLocation: 'local'
};
