/**
 * This module contains codes for testing storage controller.
 *
 * @version 1.0
 * @author spanhawk
 */
'use strict';


/**
 * Test Scorecards controller APIs.
 */
var should = require('should'); 
var assert = require('assert');
var request = require('supertest');
var async = require('async');
var config = require('config');
var _ = require('lodash');

var datasource = require('./../../datasource');
datasource.init(config);
var db = datasource.getDataSource();
var sequelize = db.sequelize;
//sequelize.options.logging = false;    // turn of sequelize logging.
var Challenge = db.Challenge;
var Submission = db.Submission;
var Participant = db.Participant;
var File = db.File;

describe('Storage Controller', function() {
  var url = 'http://localhost:'+config.app.port;
  var file, challenge, submission, participant;
  // create a challenge
  before(function(done) {
    // create a challenge
    var challengeData = {
      title: 'Storage Test Challenge',
      status: 'SUBMISSION',
      regStartAt: '2014-10-09'
    };

    Challenge.create(challengeData).success(function(savedEntity) {
      challenge = savedEntity;
      // create a participant to the challenge
      var participantData = {
        userId: 1,
        userHandle: '_indy',
        challengeId: challenge.id,
        role: 'SUBMITTER'
      };
      Participant.create(participantData).success(function(savedEntity) {
        participant = savedEntity;
        // create a submission to the challenge
        var submissionData = {
          challengeId: challenge.id,
          submitterId: 1,
          submitterHandle: '_indy',
          status: 'VALID'
        };

        Submission.create(submissionData).success(function(savedEntity) {
          submission = savedEntity;
          // add a new file to the challenge
          var fileData = {
            title: 'Storage Controller Test File Title',
            size: 123,
            fileUrl: '/uploads/my-submission.zip',
            storageLocation: 'LOCAL',
            challengeId: challenge.id,
            submissionId: submission.id
          };

          File.create(fileData).success(function(savedEntity) {
            file = savedEntity;
            done();
          });

        });
      });

    });

  });
  /**
   * Storage controller tests
   */
  describe('Storage API', function() {
    it('should be able to get download url for a file to the challenge', function(done) {
      request(url)
      .get('/challenges/'+challenge.id+'/files/'+file.id+'/download')
      .end(function(err, res) {
        // verify response
        should.not.exist(err);
        res.status.should.equal(200);
        res.body.success.should.be.true;
        res.body.status.should.equal(200);
        res.body.should.have.property('metadata');
        res.body.metadata.totalCount.should.be.above(0);
        res.body.should.have.property('content');
        res.body.content.length.should.be.above(0);
        res.body.content[0].should.have.property('url');
        done();
      });
    });

    it('should return 404 for invalid challenge id for download challenge file storage API', function(done) {
      request(url)
      .get('/challenges/'+4585474+'/files/'+file.id+'/download')
      .end(function(err, res) {
        // verify response
        should.not.exist(err);
        res.status.should.equal(404);
        res.body.result.success.should.be.false;
        res.body.result.status.should.equal(404);
        res.body.should.have.property('content');
        done();
      });
    });

    it('should return 404 for invalid file id for download challenge file storage API', function(done) {
      request(url)
      .get('/challenges/'+challenge.id+'/files/'+11134111+'/download')
      .end(function(err, res) {
        // verify response
        should.not.exist(err);
        res.status.should.equal(404);
        res.body.result.success.should.be.false;
        res.body.result.status.should.equal(404);
        res.body.should.have.property('content');
        done();
      });
    });


    it('should be able to get upload url for a file to the challenge', function(done) {
      request(url)
      .get('/challenges/'+challenge.id+'/files/'+file.id+'/upload')
      .end(function(err, res) {
        // verify response
        should.not.exist(err);
        res.status.should.equal(200);
        res.body.success.should.be.true;
        res.body.status.should.equal(200);
        res.body.should.have.property('metadata');
        res.body.metadata.totalCount.should.be.above(0);
        res.body.should.have.property('content');
        res.body.content.length.should.be.above(0);
        res.body.content[0].should.have.property('url');
        done();
      });
    });

    it('should return 404 for invalid challenge id for upload challenge file storage API', function(done) {
      request(url)
      .get('/challenges/'+4585474+'/files/'+file.id+'/upload')
      .end(function(err, res) {
        // verify response
        should.not.exist(err);
        res.status.should.equal(404);
        res.body.result.success.should.be.false;
        res.body.result.status.should.equal(404);
        res.body.should.have.property('content');
        done();
      });
    });

    it('should return 404 for invalid file id for upload challenge file storage API', function(done) {
      request(url)
      .get('/challenges/'+challenge.id+'/files/'+1111111+'/upload')
      .end(function(err, res) {
        // verify response
        should.not.exist(err);
        res.status.should.equal(404);
        res.body.result.success.should.be.false;
        res.body.result.status.should.equal(404);
        res.body.should.have.property('content');
        done();
      });
    });

    it('should be able to get download url for a file to the challenge submission', function(done) {
      request(url)
      .get('/challenges/'+challenge.id+'/submissions/'+submission.id+'/files/'+file.id+'/download')
      .end(function(err, res) {
        // verify response
        should.not.exist(err);
        res.status.should.equal(200);
        res.body.success.should.be.true;
        res.body.status.should.equal(200);
        res.body.should.have.property('metadata');
        res.body.metadata.totalCount.should.be.above(0);
        res.body.should.have.property('content');
        res.body.content.length.should.be.above(0);
        res.body.content[0].should.have.property('url');
        done();
      });
    });

    it('should return 404 for invalid challenge id for download challenge submission file storage API', function(done) {
      request(url)
      .get('/challenges/'+345345345+'/submissions/'+submission.id+'/files/'+file.id+'/download')
      .end(function(err, res) {
        // verify response
        should.not.exist(err);
        res.status.should.equal(404);
        res.body.result.success.should.be.false;
        res.body.result.status.should.equal(404);
        res.body.should.have.property('content');
        done();
      });
    });

    it('should return 404 for invalid file id for download challenge submission file storage API', function(done) {
      request(url)
      .get('/challenges/'+challenge.id+'/submissions/'+submission.id+'/files/'+3432432423+'/download')
      .end(function(err, res) {
        // verify response
        should.not.exist(err);
        res.status.should.equal(404);
        res.body.result.success.should.be.false;
        res.body.result.status.should.equal(404);
        res.body.should.have.property('content');
        done();
      });
    });


    it('should be able to get upload url for a file to the challenge submission', function(done) {
      request(url)
      .get('/challenges/'+challenge.id+'/submissions/'+submission.id+'/files/'+file.id+'/upload')
      .end(function(err, res) {
        // verify response
        should.not.exist(err);
        res.status.should.equal(200);
        res.body.success.should.be.true;
        res.body.status.should.equal(200);
        res.body.should.have.property('metadata');
        res.body.metadata.totalCount.should.be.above(0);
        res.body.should.have.property('content');
        res.body.content.length.should.be.above(0);
        res.body.content[0].should.have.property('url');
        done();
      });
    });

    it('should return 404 for invalid challenge id for upload challenge submission file storage API', function(done) {
      request(url)
      .get('/challenges/'+3434342323+'/submissions/'+submission.id+'/files/'+file.id+'/upload')
      .end(function(err, res) {
        // verify response
        should.not.exist(err);
        res.status.should.equal(404);
        res.body.result.success.should.be.false;
        res.body.result.status.should.equal(404);
        res.body.should.have.property('content');
        done();
      });
    });

    it('should return 404 for invalid file id for upload challenge submission file storage API', function(done) {
      request(url)
      .get('/challenges/'+challenge.id+'/submissions/'+submission.id+'/files/'+2342342343+'/upload')
      .end(function(err, res) {
        // verify response
        should.not.exist(err);
        res.status.should.equal(404);
        res.body.result.success.should.be.false;
        res.body.result.status.should.equal(404);
        res.body.should.have.property('content');
        done();
      });
    });

  });

});