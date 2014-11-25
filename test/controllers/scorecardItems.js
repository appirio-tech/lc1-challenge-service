/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
/**
 * This module contains codes for testing scorecardItems controller.
 *
 * @version 1.0
 * @author peakpado
 */
'use strict';


/**
 * Test ScorecardItems controller APIs.
 */
var should = require('should');
var assert = require('assert');
var request = require('supertest');
var async = require('async');
var config = require('config');
var _ = require('lodash');
var sampleData = require('./../sampledata');

var datasource = require('./../../datasource');
datasource.init(config);
var db = datasource.getDataSource();
var sequelize = db.sequelize;
sequelize.options.logging = false;    // turn of sequelize logging.
var Challenge = db.Challenge;
var Scorecard = db.Scorecard;
var ScorecardItem = db.ScorecardItem;


describe('ScorecardItems Controller', function () {
  this.timeout(15000);
  var url = 'http://localhost:' + config.app.port;
  var reqData;
  var challenge;
  var scorecard;

  before(function (done) {
    // create a challenge
    var challengeData = {
      title: 'Serenity Challenge',
      status: 'SUBMISSION',
      regStartAt: '2014-10-09'
    };

    Challenge.create(challengeData).success(function (savedEntity) {
      challenge = savedEntity;
      var scorecardData = {
        scoreSum: 97,
        status: 'NEW',
        pay: false,
        place: 1,
        challengeId: challenge.id,
        reviewerId: 222,
        submissionId: 333
      };
      Scorecard.create(scorecardData).success(function (savedScorecard) {
        scorecard = savedScorecard;
        done();
      })
    });
  });

  describe('ScorecardItems API', function () {
    var scorecardItemId;
    beforeEach(function (done) {
      reqData = _.clone(sampleData.scorecardItemData, true);
      done();
    });

    it('should able to create a scorecard item with valid data', function (done) {
      // send request
      request(url)
        .post('/challenges/' + challenge.id + '/scorecards/' + scorecard.id + '/scorecardItems')
        .send(reqData)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          // verify response
          should.not.exist(err);
          res.status.should.equal(200);
          res.body.id.should.be.a.Number;
          res.body.result.success.should.be.true;
          res.body.result.status.should.equal(200);
          scorecardItemId = res.body.id;
          done();
        });
    });

    it('should able to create a scorecard item without scorecardId in request body', function (done) {
      // send request
      request(url)
        .post('/challenges/' + challenge.id + '/scorecards/' + scorecard.id + '/scorecardItems')
        .send(reqData)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          // verify response
          should.not.exist(err);
          res.status.should.equal(200);
          res.body.id.should.be.a.Number;
          res.body.result.success.should.be.true;
          res.body.result.status.should.equal(200);
          scorecardItemId = res.body.id;
          done();
        });
    });

    it('should fail to create a scorecard item without requirementId', function (done) {
      delete reqData.requirementId;
      // send request
      request(url)
        .post('/challenges/' + challenge.id + '/scorecards/' + scorecard.id + '/scorecardItems')
        .send(reqData)
        .end(function (err, res) {
          // verify response
          res.status.should.equal(400);
          res.body.result.success.should.be.false;
          res.body.result.status.should.equal(400);
          res.body.should.have.property('content');
          done();
        });
    });

    it('should fail to create a scorecard item with scorecardId different in request body and path param', function (done) {
      reqData.scorecardId = scorecard.id + 1334;
      // send request
      request(url)
        .post('/challenges/' + challenge.id + '/scorecards/' + scorecard.id + '/scorecardItems')
        .send(reqData)
        .end(function (err, res) {
          // verify response
          res.status.should.equal(400);
          res.body.result.success.should.be.false;
          res.body.result.status.should.equal(400);
          res.body.should.have.property('content');
          done();
        });
    });

    it('should able to get the all scorecard items', function (done) {
      // send request
      request(url)
        .get('/challenges/' + challenge.id + '/scorecards/' + scorecard.id + '/scorecardItems')
        .end(function (err, res) {
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

    it('should able to get the partial response of all scorecard items', function (done) {
      // send request
      request(url)
        .get('/challenges/' + challenge.id + '/scorecards/' + scorecard.id + '/scorecardItems?fields=id')
        .end(function (err, res) {
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
          res.body.content[0].should.not.have.property('score');
          done();
        });
    });

    it('should able to get the existing scorecard item', function (done) {
      // send request
      request(url)
        .get('/challenges/' + challenge.id + '/scorecards/' + scorecard.id + '/scorecardItems/' + scorecardItemId)
        .end(function (err, res) {
          // verify response
          res.status.should.equal(200);
          res.body.success.should.be.true;
          res.body.status.should.equal(200);
          res.body.content.id.should.equal(scorecardItemId);
          res.body.content.requirementId.should.equal(reqData.requirementId);
          res.body.content.score.should.equal(reqData.score);
          res.body.content.comment.should.equal(reqData.comment);
          done();
        });
    });

    it('should able to get the existing scorecard with fields parameter and expand functionality', function (done) {
      // send request
      request(url)
        .get('/challenges/' + challenge.id + '/scorecards/' + scorecard.id + '?fields=id,scorecardItems(id,requirement)')
        .end(function (err, res) {
          // verify response
          res.status.should.equal(200);
          res.body.success.should.be.true;
          res.body.content.scorecardItems.length.should.be.above(0);
          done();
        });
    });

    it('should able to get partial response of the existing scorecard item', function (done) {
      // send request
      request(url)
        .get('/challenges/' + challenge.id + '/scorecards/' + scorecard.id + '/scorecardItems/' + scorecardItemId + '?fields=id,requirementId,score')
        .end(function (err, res) {
          // verify response
          res.status.should.equal(200);
          res.body.success.should.be.true;
          res.body.status.should.equal(200);
          res.body.content.id.should.equal(scorecardItemId);
          res.body.content.requirementId.should.equal(reqData.requirementId);
          res.body.content.score.should.equal(reqData.score);
          res.body.content.should.not.have.property('comment');
          done();
        });
    });

    it('should able to update the existing scorecard item', function (done) {
      // send request
      reqData.comment = 'Updated comment';
      request(url)
        .put('/challenges/' + challenge.id + '/scorecards/' + scorecard.id + '/scorecardItems/' + scorecardItemId)
        .send(reqData)
        .end(function (err, res) {
          // verify response
          res.status.should.equal(200);
          res.body.id.should.be.a.Number;
          res.body.id.should.equal(scorecardItemId);
          res.body.result.success.should.equal(true);
          res.body.result.status.should.equal(200);
          done();
        });
    });

    it('should able to update the existing scorecard item without scorecardId in request body', function (done) {
      // send request
      reqData.comment = 'Updated comment again';
      request(url)
        .put('/challenges/' + challenge.id + '/scorecards/' + scorecard.id + '/scorecardItems/' + scorecardItemId)
        .send(reqData)
        .end(function (err, res) {
          // verify response
          res.status.should.equal(200);
          res.body.id.should.be.a.Number;
          res.body.id.should.equal(scorecardItemId);
          res.body.result.success.should.equal(true);
          res.body.result.status.should.equal(200);
          done();
        });
    });

    it('should fail to update a scorecard item with scorecardId different in request body and path param', function (done) {
      reqData.scorecardId = scorecard.id + 1334;
      // send request
      request(url)
        .put('/challenges/' + challenge.id + '/scorecards/' + scorecard.id + '/scorecardItems/' + scorecardItemId)
        .send(reqData)
        .end(function (err, res) {
          // verify response
          res.status.should.equal(400);
          res.body.result.success.should.be.false;
          res.body.result.status.should.equal(400);
          res.body.should.have.property('content');
          done();
        });
    });

    it('should able to delete the existing scorecard item', function (done) {
      // send request
      request(url)
        .delete('/challenges/' + challenge.id + '/scorecards/' + scorecard.id + '/scorecardItems/' + scorecardItemId)
        .end(function (err, res) {
          // verify response
          res.status.should.equal(200);
          res.body.id.should.be.a.Number;
          res.body.result.success.should.equal(true);
          res.body.result.status.should.equal(200);
          done();
        });
    });
  });


  after(function (done) {
    // delete data created during test.
    async.eachSeries([Scorecard, Challenge], function (model, callback) {
      model.findAll().success(function (entities) {
        async.each(entities, function (entity, cb) {
          entity.destroy().success(function () {
            cb();
          })
            .error(function (err) {
              cb();
            });
        }, function (err) {
          callback();
        });
      });
    }, function (err) {
      done();
    });

  });

});

