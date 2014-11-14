/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
/**
 * This module contains codes for testing scorecard controller.
 *
 * @version 1.0
 * @author peakpado
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
sequelize.options.logging = false;    // turn of sequelize logging.
var Challenge = db.Challenge;
var Scorecard = db.Scorecard;


describe('Scorecards Controller', function() {
  this.timeout(15000);
  var url = 'http://localhost:'+config.app.port;
  var reqData, reqData2, reqData3, reqData4;
  var challenge;

  before(function(done) {
    // create a challenge
    var challengeData = {
      title: 'Serenity Challenge',
      status: 'SUBMISSION',
      regStartAt: '2014-10-09',
      createdBy: 1,
      updatedBy: 1
    };

    Challenge.create(challengeData).success(function(savedEntity) {
      challenge = savedEntity;
      done();
    });
  });

  describe('Scorecards API', function() {
    var scorecardId;
    beforeEach(function(done) {
      reqData = {
        scoreSum: 97,
        scorePercent: 96.5,
        scoreMax: 99.9,
        status: 'NEW',
        pay: false,
        place: 1,
        prize: 1500,
        reviewerId: 222,
        submissionId: 333
      };
      reqData2 = {
        scoreSum: 97,
        scorePercent: 96.5,
        scoreMax: 99.9,
        status: 'SAVED',
        pay: true,
        place: 1,
        prize: 1500,
        reviewerId: 222,
        submissionId: 333
      };
      reqData3 = {
        scoreSum: 97,
        scorePercent: 96.5,
        scoreMax: 99.9,
        status: 'SUBMITTED',
        pay: true,
        place: 1,
        prize: 500,
        reviewerId: 222,
        submissionId: 333
      };
      reqData4 = {
        scoreSum: 97,
        scorePercent: 96.5,
        scoreMax: 99.9,
        status: 'SUBMITTED',
        pay: true,
        place: 1,
        prize: 1500,
        reviewerId: 222,
        submissionId: 333
      };
      request(url)
        .post('/challenges/'+challenge.id+'/scorecards/')
        .send(reqData2)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
            request(url)
              .post('/challenges/'+challenge.id+'/scorecards/')
              .send(reqData3)
              .expect('Content-Type', /json/)
              .end(function(err, res) {
                  request(url)
                    .post('/challenges/'+challenge.id+'/scorecards/')
                    .send(reqData4)
                    .expect('Content-Type', /json/)
                    .end(function(err, res) {
                        done();
                    });
              });
        });
    });

    it('should able to create a scorecard with valid data', function(done) {
      // send request
      request(url)
      .post('/challenges/'+challenge.id+'/scorecards/')
      .send(reqData)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        // verify response
        should.not.exist(err);
        res.status.should.equal(200);
        res.body.id.should.be.a.Number;
        res.body.result.success.should.be.true;
        res.body.result.status.should.equal(200);
        scorecardId = res.body.id;
        done();
      });
    });

    it('should fail to create a scorecard without reviewerId', function(done) {
      delete reqData.reviewerId;
      // send request
      request(url)
      .post('/challenges/'+challenge.id+'/scorecards/')
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

    it('should able to get the all scorecards', function(done) {
      // send request
      request(url)
      .get('/challenges/'+challenge.id+'/scorecards/')
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

    it('should able to filter all scorecards whose pay=true', function(done) {
      // send request
      request(url)
          .get('/challenges/'+challenge.id+'/scorecards?filter=pay=true')
          .end(function(err, res) {
            // verify response
            should.not.exist(err);
            res.status.should.equal(200);
            res.body.success.should.be.true;
            res.body.status.should.equal(200);
            res.body.should.have.property('metadata');
            res.body.metadata.totalCount.should.be.above(0);
            res.body.should.have.property('content');
            _.forEach(res.body.content, function(scorecard){
              scorecard.pay.should.equal(true);
            });
            done();
          });
    });

    it('should able to filter all scorecards whose pay=true and status=SAVED', function(done) {
      // send request
      request(url)
          .get('/challenges/'+challenge.id+'/scorecards?filter=pay=true%26status=\'SAVED\'')
          .end(function(err, res) {
            // verify response
            should.not.exist(err);
            res.status.should.equal(200);
            res.body.success.should.be.true;
            res.body.status.should.equal(200);
            res.body.should.have.property('metadata');
            res.body.metadata.totalCount.should.be.above(0);
            res.body.should.have.property('content');
            _.forEach(res.body.content, function(scorecard){
              scorecard.status.should.equal('SAVED');
              scorecard.pay.should.equal(true);
            });
            done();
          });
    });

    it('should able to filter all scorecards whose pay=true and status=SUBMITTED and prize=500', function(done) {
      // send request
      request(url)
          .get('/challenges/'+challenge.id+'/scorecards?filter=pay=true%26status=\'SUBMITTED\'%26prize=500')
          .end(function(err, res) {
            // verify response
            should.not.exist(err);
            res.status.should.equal(200);
            res.body.success.should.be.true;
            res.body.status.should.equal(200);
            res.body.should.have.property('metadata');
            res.body.metadata.totalCount.should.be.above(0);
            res.body.should.have.property('content');
            _.forEach(res.body.content, function(scorecard){
              scorecard.status.should.equal('SUBMITTED');
              scorecard.pay.should.equal(true);
              scorecard.prize.should.equal(500);
            });
            done();
          });
    });

    it('should able to get the partial response of all scorecards', function(done) {
      // send request
      request(url)
        .get('/challenges/'+challenge.id+'/scorecards?fields=id,scoreSum')
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
          res.body.content[0].should.have.property('scoreSum');
          res.body.content[0].should.not.have.property('status');
          done();
        });
    });

    it('should able to get the existing scorecard', function(done) {
      // send request
      request(url)
      .get('/challenges/'+challenge.id+'/scorecards/'+scorecardId)
      .end(function(err, res) {
        // verify response
        res.status.should.equal(200);
        res.body.success.should.be.true;
        res.body.status.should.equal(200);
        res.body.content.id.should.equal(scorecardId);
        res.body.content.challengeId.should.equal(challenge.id);
        res.body.content.scoreSum.should.equal(reqData.scoreSum);
        res.body.content.status.should.equal(reqData.status);
        done();
      });
    });

    it('should able to get partial response of the existing scorecard', function(done) {
      // send request
      request(url)
        .get('/challenges/'+challenge.id+'/scorecards/'+scorecardId+'?fields=id,challengeId,status')
        .end(function(err, res) {
          // verify response
          res.status.should.equal(200);
          res.body.success.should.be.true;
          res.body.status.should.equal(200);
          res.body.content.id.should.equal(scorecardId);
          res.body.content.challengeId.should.equal(challenge.id);
          res.body.content.status.should.equal(reqData.status);
          res.body.content.should.not.have.property('scoreSum');
          done();
        });
    });

    it('should able to update the existing scorecard', function(done) {
      // send request
      reqData.status = 'SAVED';
      request(url)
      .put('/challenges/'+challenge.id+'/scorecards/'+scorecardId)
      .send(reqData)
      .end(function(err, res) {
        // verify response
        res.status.should.equal(200);
        res.body.id.should.be.a.Number;
        res.body.id.should.equal(scorecardId);
        res.body.result.success.should.equal(true);
        res.body.result.status.should.equal(200);
        done();
      });
    });

    it('should able to delete the existing scorecard', function(done) {
      // send request
      request(url)
      .delete('/challenges/'+challenge.id+'/scorecards/'+scorecardId)
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
    async.eachSeries([Scorecard, Challenge], function(model, callback) {
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

