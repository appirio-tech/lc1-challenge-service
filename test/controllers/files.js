/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
/**
 * This module contains codes for testing files controller.
 *
 * @version 1.0
 * @author peakpado
 */
'use strict';


/**
 * Test Files controller APIs.
 */
var should = require('should'); 
var assert = require('assert');
var request = require('supertest');
var async = require('async');
var config = require('config');

var datasource = require('./../../datasource');
datasource.init(config);
var db = datasource.getDataSource();
var sequelize = db.sequelize;
sequelize.options.logging = false;    // turn of sequelize logging.
var Challenge = db.Challenge;
var File = db.File;
var Submission = db.Submission;


describe('Files Controller', function() {
  this.timeout(15000);
  var url = 'http://localhost:'+config.app.port;
  var reqData;
  var challenge;
  var submission;

  before(function(done) {
    // create a challenge
    var challengeData = {
      title: 'Serenity Challenge',
      status: 'SUBMISSION',
      regStartAt: '2014-10-09'
    };

    Challenge.create(challengeData).success(function(savedEntity) {
      challenge = savedEntity;
      var submissionData = {
        challengeId: challenge.id,
        submitterId: 222,
        status : 'VALID'
      };
      Submission.create(submissionData).success(function(savedSubmission) {
        submission = savedSubmission;
        done();
      })
    });
  });

  describe('Files API', function() {
    var fileId;
    beforeEach(function(done) {
      reqData = {
        title: 'File Title',
        filePath: '/uploads',
        size: 123,
        fileName: 'my-submission.zip',
         fileUrl : '/uploads/my-submission.zip',
        storageLocation: 'LOCAL'
      };
      done();
    });

    it('should able to create a file with valid data', function(done) {
      // send request
      request(url)
      .post('/challenges/'+challenge.id+'/submissions/'+submission.id+'/files')
      .send(reqData)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        // verify response
        should.not.exist(err);
        res.status.should.equal(200);
        res.body.id.should.be.a.Number;
        res.body.result.success.should.be.true;
        res.body.result.status.should.equal(200);
        fileId = res.body.id;
        done();
      });
    });

    it('should fail to create a file without fileUrl', function(done) {
      delete reqData.fileUrl;
      // send request
      request(url)
      .post('/challenges/'+challenge.id+'/submissions/'+submission.id+'/files')
      .send(reqData)
      .end(function(err, res) {
        // verify response
        res.status.should.equal(400);
        res.body.result.success.should.be.false;
        res.body.result.status.should.equal(400);
        res.body.should.have.property('content');
        done();
      });
    });

    it('should able to get the all files', function(done) {
      // send request
      request(url)
      .get('/challenges/'+challenge.id+'/submissions/'+submission.id+'/files')
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
        done();
      });
    });

    it('should able to get the partial response of all files', function(done) {
      // send request
      request(url)
        .get('/challenges/'+challenge.id+'/submissions/'+submission.id+'/files?fields=id')
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
          res.body.content[0].should.have.property('id');
          res.body.content[0].should.not.have.property('title');
          res.body.content[0].should.not.have.property('fileName');
          res.body.content[0].should.not.have.property('challengeId');
          done();
        });
    });

    it('should able to get the existing file', function(done) {
      // send request
      request(url)
      .get('/challenges/'+challenge.id+'/submissions/'+submission.id+'/files/'+fileId)
      .end(function(err, res) {
        // verify response
        res.status.should.equal(200);
        res.body.success.should.be.true;
        res.body.status.should.equal(200);
        res.body.content.id.should.equal(fileId);
        res.body.content.challengeId.should.equal(challenge.id);
        res.body.content.title.should.equal(reqData.title);
        res.body.content.fileName.should.equal(reqData.fileName);
        done();
      });
    });

    it('should able to get partial response of the existing file', function(done) {
      // send request
      request(url)
        .get('/challenges/'+challenge.id+'/submissions/'+submission.id+'/files/'+fileId+ '?fields=id')
        .end(function(err, res) {
          // verify response
          res.status.should.equal(200);
          res.body.success.should.be.true;
          res.body.status.should.equal(200);
          res.body.content.id.should.equal(fileId);
          res.body.content.should.not.have.property('title');
          res.body.content.should.not.have.property('fileUrl');
          res.body.content.should.not.have.property('challengeId');
          done();
        });
    });

    it('should able to update the existing file', function(done) {
      // send request
      reqData.title = 'Updated file';
      request(url)
      .put('/challenges/'+challenge.id+'/submissions/'+submission.id+'/files/'+fileId)
      .send(reqData)
      .end(function(err, res) {
        // verify response
        res.status.should.equal(200);
        res.body.id.should.be.a.Number;
        res.body.id.should.equal(fileId);
        res.body.result.success.should.equal(true);
        res.body.result.status.should.equal(200);
        done();
      });
    });

    it('should able to delete the existing file', function(done) {
      // send request
      request(url)
      .delete('/challenges/'+challenge.id+'/submissions/'+submission.id+'/files/'+fileId)
      .end(function(err, res) {
        // verify response
        res.status.should.equal(200);
        res.body.id.should.be.a.Number;
        res.body.result.success.should.equal(true);
        res.body.result.status.should.equal(200);
        done();
      });
    });
  });


  after(function(done) {
    // delete data created during test.
    async.eachSeries([Submission, File, Challenge], function(model, callback) {
      model.findAll().success(function(entities) {
        async.each(entities, function(entity, cb) {
          entity.destroy().success(function() {
            cb();
          })
          .error(function(err) {
            cb();
          });
        }, function(err) {
          callback();
        });
      });
    }, function(err) {
      done();
    });

  });

});

