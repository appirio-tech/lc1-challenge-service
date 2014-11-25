'use strict';

var exports = module.exports = {};

/**
 * Sample request data
 */

exports.challengeData = {
  title: 'Serenity Challenge',
  status: 'SUBMISSION',
  prizes: [500.00, 250.00],
  regStartAt: '2014-10-09',
  projectId: 'PROJECT1',
  projectSource: 'TOPCODER'
};

exports.challengeFileData = {
  title: 'File Title',
  size: 123,
  fileUrl: '/uploads/my-submission.zip',
  storageLocation: 'LOCAL'
};

exports.participantData = {
  role: 'SUBMITTER',
  userId: 222,
  userHandle: 'user_222'
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
  requirementId: 222,
  comment: 'excellent job'
};

exports.submissionData = {
  submitterHandle: 'submitter_222',
  status: 'VALID'
};

exports.submissionFileData = {
  title: 'File Title',
  size: 123,
  fileUrl: '/uploads/my-submission.zip',
  storageLocation: 'LOCAL'
};
