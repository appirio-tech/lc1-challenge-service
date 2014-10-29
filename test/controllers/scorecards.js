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
  var url = 'http://localhost:'+config.app.port;
  var reqData;
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

  describe('Scorecards API', function() {
    var scorecardId;
    beforeEach(function(done) {
      reqData = {
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
      done();
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

    it('should able to get partial response for all scorecards', function(done) {
      // send request
      request(url)
      .get('/challenges/'+challenge.id+'/scorecards?fields=id,scoreSum,scorePercent')
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
        // verify partial response from API
        _.forEach(res.body.content, function(obj) {
          _.keys(obj).length.should.equal(3);
        });
        done();
      });
    });

    it('should fail to get partial response for invalid field request', function(done) {
      // send request
      request(url)
      .get('/challenges/'+challenge.id+'/scorecards?fields=id,scoreSum,scorePercent,invalidfield')
      .end(function(err, res) {
        // verify response
        should.not.exist(err);
        res.status.should.equal(400);
        res.body.result.success.should.equal(false);
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

    it('should able to get partial response for existing scorecard', function(done) {
      // send request
      request(url)
      .get('/challenges/'+challenge.id+'/scorecards/'+scorecardId+'?fields=id,scoreSum,scorePercent,challengeId,status')
      .end(function(err, res) {
        // verify response
        res.status.should.equal(200);
        res.body.success.should.be.true;
        res.body.status.should.equal(200);
        res.body.content.id.should.equal(scorecardId);
        res.body.content.challengeId.should.equal(challenge.id);
        res.body.content.scoreSum.should.equal(reqData.scoreSum);
        res.body.content.status.should.equal(reqData.status);
        // verify partial response from API
        _.keys(res.body.content).length.should.equal(5);
        done();
      });
    });

    it('should able to update the existing scorecard', function(done) {
      // send request
      reqData.status = 'LATE';
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

