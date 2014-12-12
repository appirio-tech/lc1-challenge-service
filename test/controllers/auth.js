/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
/**
 * This module contains codes for testing auth library.
 *
 * @version 1.0
 * @author lovefreya
 */
'use strict';

var should = require('should');
var request = require('supertest');
var async = require('async');
var config = require('config');

var datasource = require('./../../datasource');
datasource.init(config);
var db = datasource.getDataSource();
var sequelize = db.sequelize;
sequelize.options.logging = false; // turn of sequelize logging.
var Challenge = db.Challenge;


describe('Auth library', function() {
  this.timeout(15000);
  var url = 'http://localhost:' + config.app.port;
  var challenge;
  var challengeData;

  before(function(done) {
    done();
  });

  describe('Permission Check', function() {
    beforeEach(function(done) {
      challengeData = {
        title: 'Serenity Challenge',
        status: 'DRAFT',
        regStartAt: '2014-10-09',
        projectSource: 'TOPCODER'
      };
      done();
    });

    it('have permission to execute a post request: craete a challenge', function(done) {
      // send request
      request(url)
        .post('/challenges')
        .send(challengeData)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          // verify response
          should.not.exist(err);
          res.status.should.equal(200);
          res.body.id.should.be.a.Number;
          res.body.result.success.should.be.true;
          res.body.result.status.should.equal(200);
          challenge = res.body.id;
          console.log(challenge);
          done();
        });
    });
    it('have permission to execute a delete request: delete a challenge', function(done) {
      // send request
      request(url)
        .delete('/challenges/' + challenge.id)
        .end(function(err, res) {
          // verify response
          res.status.should.equal(403);
          res.body.result.success.should.equal(false);
          res.body.result.status.should.equal(403);
          done();
        });
    });
  });


  after(function(done) {
    // delete data created during test.
    async.eachSeries([Challenge], function(model, callback) {
      model.findAll().success(function(entities) {
        async.each(entities, function(entity, cb) {
          entity.destroy().success(function() {
              cb();
            })
            .error(function() {
              cb();
            });
        }, function() {
          callback();
        });
      });
    }, function() {
      done();
    });

  });

});
