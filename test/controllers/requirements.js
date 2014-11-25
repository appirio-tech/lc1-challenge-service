/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
/**
 * This module contains codes for testing requirements controller.
 *
 * @version 1.0
 * @author spanhawk
 */
'use strict';


/**
 * Test RequiremeNt controller APIs.
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
var Requirement = db.Requirement;
var Challenge = db.Challenge;


describe('Requirements Controller', function () {
  this.timeout(15000);
  var url = 'http://localhost:' + config.app.port;
  var reqData;
  var challenge;

  before(function (done) {
    // create a challenge
    var challengeData = {
      title: 'Serenity Challenge',
      status: 'SUBMISSION',
      regStartAt: '2014-10-09'
    };

    Challenge.create(challengeData).success(function (savedEntity) {
      challenge = savedEntity;
      done();
    });
  });

  describe('Requirements API', function () {
    var requirementId;
    beforeEach(function (done) {
      reqData = _.clone(sampleData.requirementData, true);
      done();
    });

    it('should able to create a requirement item with valid data', function (done) {
      // send request
      request(url)
        .post('/challenges/' + challenge.id + '/requirements')
        .send(reqData)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          // verify response
          should.not.exist(err);
          res.status.should.equal(200);
          res.body.id.should.be.a.Number;
          res.body.result.success.should.be.true;
          res.body.result.status.should.equal(200);
          requirementId = res.body.id;
          done();
        });
    });

    it('should able to create a requirement item without challengeId in request body', function (done) {
      // send request
      request(url)
        .post('/challenges/' + challenge.id + '/requirements')
        .send(reqData)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          // verify response
          should.not.exist(err);
          res.status.should.equal(200);
          res.body.id.should.be.a.Number;
          res.body.result.success.should.be.true;
          res.body.result.status.should.equal(200);
          requirementId = res.body.id;
          done();
        });
    });

    it('should fail to create a requirement with challenge id diferrent in request body and path param', function (done) {
      reqData.challengeId = challenge.id + 3434;
      // send request
      request(url)
        .post('/challenges/' + challenge.id + '/requirements')
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

    it('should able to get the all requirements', function (done) {
      // send request
      request(url)
        .get('/challenges/' + challenge.id + '/requirements')
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

    it('should able to get the partial response of all requirements', function (done) {
      // send request
      request(url)
        .get('/challenges/' + challenge.id + '/requirements?fields=id')
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
          res.body.content[0].should.not.have.property('requirementText');
          done();
        });
    });

    it('should able to get the existing requirement', function (done) {
      // send request
      request(url)
        .get('/challenges/' + challenge.id + '/requirements/' + requirementId)
        .end(function (err, res) {
          // verify response
          res.status.should.equal(200);
          res.body.success.should.be.true;
          res.body.status.should.equal(200);
          res.body.content.id.should.equal(requirementId);
          res.body.content.requirementText.should.equal(reqData.requirementText);
          done();
        });
    });

    it('should able to get partial response of the existing requirement', function (done) {
      // send request
      request(url)
        .get('/challenges/' + challenge.id + '/requirements/' + requirementId + '?fields=requirementText')
        .end(function (err, res) {
          // verify response
          res.status.should.equal(200);
          res.body.success.should.be.true;
          res.body.status.should.equal(200);
          res.body.content.requirementText.should.equal(reqData.requirementText);
          res.body.content.should.not.have.property('id');
          done();
        });
    });

    it('should able to update the existing requirement', function (done) {
      // send request
      reqData.requirementText = 'Mocha tests along with deployment guide';
      request(url)
        .put('/challenges/' + challenge.id + '/requirements/' + requirementId)
        .send(reqData)
        .end(function (err, res) {
          // verify response
          res.status.should.equal(200);
          res.body.id.should.be.a.Number;
          res.body.id.should.equal(requirementId);
          res.body.result.success.should.equal(true);
          res.body.result.status.should.equal(200);
          done();
        });
    });

    it('should able to update the existing requirement without challengeId in request body', function (done) {
      // send request
      reqData.requirementText = 'Mocha tests along with deployment guide updated';
      request(url)
        .put('/challenges/' + challenge.id + '/requirements/' + requirementId)
        .send(reqData)
        .end(function (err, res) {
          // verify response
          res.status.should.equal(200);
          res.body.id.should.be.a.Number;
          res.body.id.should.equal(requirementId);
          res.body.result.success.should.equal(true);
          res.body.result.status.should.equal(200);
          done();
        });
    });

    it('should fail to update the existing requirement with challengeId different in request body and path param', function (done) {
      reqData.challengeId = challenge.api + 3434;
      // send request
      request(url)
        .put('/challenges/' + challenge.id + '/requirements/' + requirementId)
        .end(function (err, res) {
          // verify response
          res.status.should.equal(400);
          res.body.result.success.should.be.false;
          res.body.result.status.should.equal(400);
          res.body.should.have.property('content');
          done();
        });
    });

    it('should delete the existing requirement', function (done) {
      // send request
      request(url)
        .delete('/challenges/' + challenge.id + '/requirements/' + requirementId)
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
    async.eachSeries([Challenge], function (model, callback) {
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

