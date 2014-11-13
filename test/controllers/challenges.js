/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
/**
 * This module contains codes for testing challenges controller.
 *
 * @version 1.0
 * @author peakpado
 */
'use strict';


/**
 * Challenges controller test.
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
var Participant = db.Participant;
var Submission = db.Submission;

/**
 * Test Challenges controller APIs
 */
describe('Challenges Controller', function() {
  this.timeout(15000);
  var url = 'http://localhost:'+config.app.port;
  var reqData;

  describe('Challenges API', function() {
    var challengeId;
    beforeEach(function(done) {
      reqData = {
        title: 'Serenity Challenge',
        status: 'SUBMISSION',
        account: 'account',
        accountId: '12ASD',
        prizes: [500.00, 250.00],
        regStartAt: '2014-10-09'
      };
      done();
    });

    it('should able to create a challenge with valid data', function(done) {
      // send request
      request(url)
      .post('/challenges')
      .send(reqData)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        // verify response
        should.not.exist(err);
        res.status.should.equal(200);
        res.body.id.should.be.a.Number;
        res.body.result.success.should.be.true;
        res.body.result.status.should.equal(200);
        challengeId = res.body.id;
        done();
      });
    });

    it('should fail to create a challenge without status', function(done) {
      delete reqData.status;
      // send request
      request(url)
      .post('/challenges')
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

    it('should able to get the all challenges', function(done) {
      // send request
      request(url)
      .get('/challenges')
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

    it('should able to get partial response of all challenges', function(done){
      request(url)
        .get('/challenges?fields=id')
        .end(function(err, res){
          should.not.exist(err);
          res.status.should.equal(200);
          res.body.success.should.be.true;
          res.body.status.should.equal(200);
          res.body.should.have.property('metadata');
          res.body.metadata.totalCount.should.be.above(0);
          res.body.should.have.property('content');
          res.body.content.length.should.be.above(0);
          res.body.content[0].should.not.have.property('title');
          done();
        });
    });

    it('should able to get the existing challenge', function(done) {
      // send request
      request(url)
      .get('/challenges/'+challengeId)
      .end(function(err, res) {
        // verify response
        res.status.should.equal(200);
        res.body.success.should.be.true;
        res.body.status.should.equal(200);
        res.body.content.id.should.equal(challengeId);
        res.body.content.title.should.equal(reqData.title);
        res.body.content.status.should.equal(reqData.status);
        done();
      });
    });

    it('should able to get partial response of the existing challenge', function(done) {
      // send request
      request(url)
        .get('/challenges/'+challengeId+'?fields=id')
        .end(function(err, res) {
          // verify response
          console.log(res.body);
          res.status.should.equal(200);
          res.body.success.should.be.true;
          res.body.status.should.equal(200);
          res.body.content.id.should.equal(challengeId);
          res.body.content.should.not.have.property('title');
          done();
        });
    });

    it('should able to update the existing challenge', function(done) {
      // send request
      reqData.title = 'Updated Challenge';
      request(url)
      .put('/challenges/'+challengeId)
      .send(reqData)
      .end(function(err, res) {
        // verify response
        res.status.should.equal(200);
        res.body.id.should.be.a.Number;
        res.body.id.should.equal(challengeId);
        res.body.result.success.should.equal(true);
        res.body.result.status.should.equal(200);
        done();
      });
    });

    it('should able to delete the existing challenge', function(done) {
      // send request
      request(url)
      .delete('/challenges/'+challengeId)
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


  describe('Paging, orderBy and filtering in get all challenges API', function() {
    var challenges = [];
    before(function(done) {
      var statuses = ['SUBMISSION', 'REVIEW', 'COMPLETE'];
      // create 10 challenges
      async.timesSeries(10, function(index, callback) {
        var createdBy = '_indy-'+index;
        if (index === 4) {
          createdBy = undefined;
        }
        // create a challenge
        var challengeData = {
          title: 'Serenity Challenge '+index,
          status: statuses[index % 3],
          regStartAt: '2014-10-0'+(index+1),  // index starts at 0
          createdBy: createdBy
        };
        Challenge.create(challengeData).success(function(savedEntity) {
          challenges.push(savedEntity);
          callback();
        });
      }, function(err) {
        should.not.exist(err);
        done();
      });
    });

    function sendGetAllChallengesRequest(params, callback) {
      request(url)
      .get('/challenges?'+params)
      .end(function(err, res) {
        callback(err, res);
      });
    };

    it('should able to limit the number of challenges in the response', function(done) {
      var limit = 3;
      async.timesSeries(3, function(i, next) {
        var params = 'limit='+limit;
        // send request
        sendGetAllChallengesRequest(params, function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.body.success.should.be.true;
          res.body.content.length.should.equal(limit);
          next(err);
        });
      }, function(err) {
        done();
      });
    });

    it('should failed to get the all challenges with non-digit limit', function(done) {
      // send request
      request(url)
      .get('/challenges?limit=xxx')
      .end(function(err, res) {
        // verify response
        res.status.should.equal(400);
        res.body.result.success.should.be.false;
        res.body.result.status.should.equal(400);
        done();
      });
    });

    it('should able to get a page of challenges by offset', function(done) {
      var limit = 3;
      var challengeIds = {};

      async.timesSeries(3, function(i, next) {
        var params = 'limit='+limit+'&offset='+(i*3);
        // send request
        sendGetAllChallengesRequest(params, function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.body.success.should.be.true;
          async.eachSeries(res.body.content, function(challenge, innerNext) {
            challengeIds.should.not.have.property(challenge.id);
            challengeIds[challenge.id] = challenge.id;
            innerNext();
          }, function(err) {
            next(err);
          });
        });
      }, function(err) {
        done();
      });
    });

    it('should able to get the challenges in ascending order', function(done) {
      var limit = 3;
      var prevId = -1;
      async.timesSeries(3, function(i, next) {
        var params = 'limit='+limit+'&offset='+(i*3)+'&orderBy=id asc';
        // send request
        sendGetAllChallengesRequest(params, function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.body.success.should.be.true;
          async.eachSeries(res.body.content, function(challenge, innerNext) {
            challenge.id.should.be.above(prevId);
            prevId = challenge.id;
            innerNext();
          }, function(err) {
            next();
          });
        });
      }, function(err) {
        done();
      });
    });

    it('should able to get the challenges in descending order', function(done) {
      var limit = 3;
      var prevId = 999999;
      async.timesSeries(3, function(i, next) {
        var params = 'limit='+limit+'&offset='+(i*3)+'&orderBy=id desc';
        // send request
        sendGetAllChallengesRequest(params, function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.body.success.should.be.true;
          async.eachSeries(res.body.content, function(challenge, innerNext) {
            challenge.id.should.be.below(prevId);
            prevId = challenge.id;
            innerNext();
          }, function(err) {
            next();
          });
        });
      }, function(err) {
        done();
      });
    });

    it('should able to get nulls first by nulls first in the challenges response', function(done) {
        var params = 'orderBy=createdBy desc nulls first';
        // send request
        sendGetAllChallengesRequest(params, function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.body.success.should.be.true;

          var firstChallenge = res.body.content[0];
          (firstChallenge.createdBy === null).should.be.true;
          var lastChallenge = res.body.content[res.body.content.length-1];
          lastChallenge.createdBy.should.be.ok;
          done();
        });
    });

    it('should able to get nulls last by nulls last in the challenges response', function(done) {
        var params = 'orderBy=createdBy desc nulls last';
        // send request
        sendGetAllChallengesRequest(params, function(err, res) {
          should.not.exist(err);
          res.status.should.equal(200);
          res.body.success.should.be.true;

          var firstChallenge = res.body.content[0];
          firstChallenge.createdBy.should.be.ok;
          var lastChallenge = res.body.content[res.body.content.length-1];
          (lastChallenge.createdBy === null).should.be.true;
          done();
        });
    });

    it('should fail to get challenges without first or last in nulls filter', function(done) {
        var params = 'orderBy=createdBy desc nulls';
        // send request
        sendGetAllChallengesRequest(params, function(err, res) {
          should.not.exist(err);
          res.status.should.equal(400);
          res.body.result.success.should.be.false;
          done();
        });
    });

    it('should able to filter the challenges by field value', function(done) {
      var params = "filter=status='SUBMISSION'";
      // send request
      sendGetAllChallengesRequest(params, function(err, res) {
        should.not.exist(err);
        res.status.should.equal(200);
        res.body.success.should.be.true;
        async.eachSeries(res.body.content, function(challenge, innerNext) {
          challenge.status.should.equal('SUBMISSION');
          innerNext();
        }, function(err) {
          done();
        });
      });
    });

    it('should able to filter the challenges by in operator', function(done) {
      var params = "filter=status=in('SUBMISSION','REVIEW')";
      // send request
      sendGetAllChallengesRequest(params, function(err, res) {
        should.not.exist(err);
        res.status.should.equal(200);
        res.body.success.should.be.true;
        async.eachSeries(res.body.content, function(challenge, innerNext) {
          challenge.status.should.not.equal('COMPLETE');
          innerNext();
        }, function(err) {
          done();
        });
      });
    });

    it('should able to filter the challenges by < operator in filtering', function(done) {
      var middleId = challenges[4].id;
      var params = 'filter=id<'+middleId;
      // send request
      sendGetAllChallengesRequest(params, function(err, res) {
        should.not.exist(err);
        res.status.should.equal(200);
        res.body.success.should.be.true;
        async.eachSeries(res.body.content, function(challenge, innerNext) {
          challenge.id.should.below(middleId);
          innerNext();
        }, function(err) {
          done();
        });
      });
    });

    it('should able to filter the challenges by > operator in filtering', function(done) {
      var middleId = challenges[4].id;
      var params = 'filter=id>'+middleId;
      // send request
      sendGetAllChallengesRequest(params, function(err, res) {
        should.not.exist(err);
        res.status.should.equal(200);
        res.body.success.should.be.true;
        async.eachSeries(res.body.content, function(challenge, innerNext) {
          challenge.id.should.above(middleId);
          innerNext();
        }, function(err) {
          done();
        });
      });
    });

  });


  describe('The Nested Resources', function() {
    var challenge;
    before(function(done) {
      // create a challenge
      var challengeData = {
        title: 'Serenity Challenge',
        status: 'SUBMISSION',
        regStartAt: '2014-10-09'
      };
      Challenge.create(challengeData).success(function(savedEntity) {
        challenge = savedEntity;
        done();
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
        .post('/challenges/'+challenge.id+'/files')
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
        .post('/challenges/'+challenge.id+'/files')
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
        .get('/challenges/'+challenge.id+'/files')
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

      it('should able to get partial response of the all files', function(done) {
        // send request
        request(url)
          .get('/challenges/'+challenge.id+'/files?fields=id')
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
            res.body.content[0].should.not.have.property('title');
            done();
          });
      });

      it('should able to the get partial response and nested file objects of the exist challenge', function(done){
        request(url)
          .get('/challenges/'+challenge.id+'?fields=id,title,files')
          .end(function(err, res) {
            //verify response
            should.not.exist(err);
            res.status.should.equal(200);
            res.body.success.should.be.true;
            res.body.status.should.equal(200);
            res.body.should.have.property('content');
            res.body.content.should.have.property('files');
            res.body.content.files.length.should.be.above(0);
            res.body.content.files[0].should.have.property('id');
            done();
          });
      });

      it('should able to get partial response of the exist challenge and its nested file object with partial fields', function(done){
        request(url)
          .get('/challenges/'+challenge.id+'?fields=id,title,files(id,title)')
          .end(function(err, res) {
            //verify response
            should.not.exist(err);
            res.status.should.equal(200);
            res.body.success.should.be.true;
            res.body.status.should.equal(200);
            res.body.should.have.property('content');
            res.body.content.should.have.property('files');
            res.body.content.files.length.should.be.above(0);
            res.body.content.files[0].should.have.property('title');
            res.body.content.files[0].should.not.have.property('challengeId');
            done();
          });
      });

      it('should able to get the existing file', function(done) {
        // send request
        request(url)
        .get('/challenges/'+challenge.id+'/files/'+fileId)
        .end(function(err, res) {
          // verify response
          res.status.should.equal(200);
          res.body.success.should.be.true;
          res.body.status.should.equal(200);
          res.body.content.id.should.equal(fileId);
          res.body.content.challengeId.should.equal(challenge.id);
          res.body.content.title.should.equal(reqData.title);
          res.body.content.fileUrl.should.equal(reqData.fileUrl);
          done();
        });
      });

      it('should able to get partial response of the existing file', function(done) {
        // send request
        request(url)
          .get('/challenges/'+challenge.id+'/files/'+fileId+'?fields=id,title')
          .end(function(err, res) {
            // verify response
            res.status.should.equal(200);
            res.body.success.should.be.true;
            res.body.status.should.equal(200);
            res.body.content.id.should.equal(fileId);
            res.body.content.title.should.equal(reqData.title);
            res.body.content.should.not.have.property('challengeId');
            done();
          });
      });

      it('should able to update the existing file', function(done) {
        // send request
        reqData.title = 'Updated file';
        request(url)
        .put('/challenges/'+challenge.id+'/files/'+fileId)
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
        .delete('/challenges/'+challenge.id+'/files/'+fileId)
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

    describe('Participants API', function() {
      // updating the test cases challengeId is not required in post and put request
      var participantId;
      beforeEach(function(done) {
        reqData = {
          role: 'SUBMITTER',
          userId: 222
        };
        done();
      });

      it('should able to create a participant with valid data', function(done) {
        // send request
        request(url)
        .post('/challenges/'+challenge.id+'/participants')
        .send(reqData)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          // verify response
          should.not.exist(err);
          res.status.should.equal(200);
          res.body.id.should.be.a.Number;
          res.body.result.success.should.be.true;
          res.body.result.status.should.equal(200);
          participantId = res.body.id;
          done();
        });
      });

      it('should fail to create a participant without role', function(done) {
        delete reqData.role;
        // send request
        request(url)
        .post('/challenges/'+challenge.id+'/participants')
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

      it('should able to create a participant without challengeId in request body', function(done) {
        // send request
        request(url)
        .post('/challenges/'+challenge.id+'/participants')
        .send(reqData)
        .end(function(err, res) {
          // verify response
          should.not.exist(err);
          res.status.should.equal(200);
          res.body.id.should.be.a.Number;
          res.body.result.success.should.be.true;
          res.body.result.status.should.equal(200);
          participantId = res.body.id;
          done();
        });
      });

      it('should fail to create a participant with different challengeId in request body than path param', function(done) {
        // adding some random number to path param challenge id to make it different
        reqData.challengeId = challenge.id + 120;
        // send request
        request(url)
        .post('/challenges/'+challenge.id+'/participants')
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

      it('should able to get the all participants', function(done) {
        // send request
        request(url)
        .get('/challenges/'+challenge.id+'/participants')
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

      it('should able to get the partial response of all participants', function(done) {
        // send request
        request(url)
          .get('/challenges/'+challenge.id+'/participants?fields=id')
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
            res.body.content[0].should.not.have.property('challengeId');
            done();
          });
      });

      it('should able to get the existing participant', function(done) {
        // send request
        request(url)
        .get('/challenges/'+challenge.id+'/participants/'+participantId)
        .end(function(err, res) {
          // verify response
          res.status.should.equal(200);
          res.body.success.should.be.true;
          res.body.status.should.equal(200);
          res.body.content.id.should.equal(participantId);
          res.body.content.challengeId.should.equal(challenge.id);
          res.body.content.role.should.equal(reqData.role);
          done();
        });
      });

      it('should able to get partial response of the existing participant', function(done) {
        // send request
        request(url)
          .get('/challenges/'+challenge.id+'/participants/'+participantId+'?fields=id')
          .end(function(err, res) {
            // verify response
            res.status.should.equal(200);
            res.body.success.should.be.true;
            res.body.status.should.equal(200);
            res.body.content.id.should.equal(participantId);
            res.body.content.should.not.have.property('challengeId');
            done();
          });
      });

      it('should able to update the existing participant', function(done) {
        // send request
        reqData.role = 'REVIEWER';
        request(url)
        .put('/challenges/'+challenge.id+'/participants/'+participantId)
        .send(reqData)
        .end(function(err, res) {
          // verify response
          res.status.should.equal(200);
          res.body.id.should.be.a.Number;
          res.body.id.should.equal(participantId);
          res.body.result.success.should.equal(true);
          res.body.result.status.should.equal(200);
          done();
        });
      });

      it('should able to update the existing participant without challengeId in request body', function(done) {
        reqData.role = 'SUBMITTER';
        // send request
        request(url)
        .put('/challenges/'+challenge.id+'/participants/' + participantId)
        .send(reqData)
        .end(function(err, res) {
          // verify response
          should.not.exist(err);
          res.status.should.equal(200);
          res.body.id.should.be.a.Number;
          res.body.result.success.should.be.true;
          res.body.result.status.should.equal(200);
          participantId = res.body.id;
          done();
        });
      });

      it('should fail to update the existing participant with different challengeId in request body than path param', function(done) {
        // adding some random number to path param challenge id to make it different
        reqData.challengeId = challenge.id + 120;
        // send request
        request(url)
        .put('/challenges/'+challenge.id+'/participants/' + participantId)
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

      it('should able to delete the existing participant', function(done) {
        // send request
        request(url)
        .delete('/challenges/'+challenge.id+'/participants/'+participantId)
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

    describe('Submissions API', function() {
      var submissionId;
      beforeEach(function(done) {
        reqData = {
          submitterId: 222,
          status : 'VALID'
        };
        done();
      });

      it('should able to create a submission with valid data', function(done) {
        // send request
        request(url)
        .post('/challenges/'+challenge.id+'/submissions')
        .send(reqData)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          // verify response
          should.not.exist(err);
          res.status.should.equal(200);
          res.body.id.should.be.a.Number;
          res.body.result.success.should.be.true;
          res.body.result.status.should.equal(200);
          submissionId = res.body.id;
          done();
        });
      });

      it('should able to create a submission without challengeId in request body', function(done) {
        // send request
        request(url)
        .post('/challenges/'+challenge.id+'/submissions')
        .send(reqData)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          // verify response
          should.not.exist(err);
          res.status.should.equal(200);
          res.body.id.should.be.a.Number;
          res.body.result.success.should.be.true;
          res.body.result.status.should.equal(200);
          submissionId = res.body.id;
          done();
        });
      });

      it('should fail to create a submission with different challengeId in request body than path param', function(done) {
        reqData.challengeId = challenge.id + 234;
        // send request
        request(url)
        .post('/challenges/'+challenge.id+'/submissions')
        .send(reqData)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          // verify response
          res.status.should.equal(400);
          res.body.result.success.should.be.false;
          res.body.result.status.should.equal(400);
          res.body.should.have.property('content');
          done();
        });
      });

      it('should fail to create a submission without submitterId', function(done) {
        delete reqData.submitterId;
        // send request
        request(url)
        .post('/challenges/'+challenge.id+'/submissions')
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

       it('should fail to create a submission without status', function(done) {
        delete reqData.status;
        // send request
        request(url)
        .post('/challenges/'+challenge.id+'/submissions')
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

      it('should able to get the all submissions', function(done) {
        // send request
        request(url)
        .get('/challenges/'+challenge.id+'/submissions')
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

      it('should able to get the partial response of all submissions', function(done) {
        // send request
        request(url)
          .get('/challenges/'+challenge.id+'/submissions?fields=id')
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
            res.body.content[0].should.not.have.property('submitterId');
            res.body.content[0].should.not.have.property('challengeId');
            done();
          });
      });

      it('should able to get the existing submission', function(done) {
        // send request
        request(url)
        .get('/challenges/'+challenge.id+'/submissions/'+submissionId)
        .end(function(err, res) {
          // verify response
          res.status.should.equal(200);
          res.body.success.should.be.true;
          res.body.status.should.equal(200);
          res.body.content.id.should.equal(submissionId);
          res.body.content.challengeId.should.equal(challenge.id);
          res.body.content.submitterId.should.equal(reqData.submitterId);
          done();
        });
      });

      it('should able to get partial response of the existing submission', function(done) {
        // send request
        request(url)
          .get('/challenges/'+challenge.id+'/submissions/'+submissionId+'?fields=id,submitterId')
          .end(function(err, res) {
            // verify response
            res.status.should.equal(200);
            res.body.success.should.be.true;
            res.body.status.should.equal(200);
            res.body.content.id.should.equal(submissionId);
            res.body.content.submitterId.should.equal(reqData.submitterId);
            res.body.content.should.not.have.property('challengeId');
            done();
          });
      });

      it('should able to update the existing submission', function(done) {
        // send request
        reqData.submitterId = 123;
        request(url)
        .put('/challenges/'+challenge.id+'/submissions/'+submissionId)
        .send(reqData)
        .end(function(err, res) {
          // verify response
          res.status.should.equal(200);
          res.body.id.should.be.a.Number;
          res.body.id.should.equal(submissionId);
          res.body.result.success.should.equal(true);
          res.body.result.status.should.equal(200);
          done();
        });
      });

      it('should able to update the existing submission without challengeId in request body', function(done) {
        // send request
        reqData.submitterId = 123;
        request(url)
        .put('/challenges/'+challenge.id+'/submissions/'+submissionId)
        .send(reqData)
        .end(function(err, res) {
          // verify response
          res.status.should.equal(200);
          res.body.id.should.be.a.Number;
          res.body.id.should.equal(submissionId);
          res.body.result.success.should.equal(true);
          res.body.result.status.should.equal(200);
          done();
        });
      });

      it('should fail to update the existing submission with challengeId different in request body and path param', function(done) {
        // send request
        reqData.submitterId = 123;
        reqData.challengeId = challenge.id + 2324;
        request(url)
        .put('/challenges/'+challenge.id+'/submissions/'+submissionId)
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

      it('should able to delete the existing submission', function(done) {
        // send request
        request(url)
        .delete('/challenges/'+challenge.id+'/submissions/'+submissionId)
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

  });

  after(function(done) {
    // delete data created during test.
    async.eachSeries([Submission, Participant, File, Challenge], function(model, callback) {
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

