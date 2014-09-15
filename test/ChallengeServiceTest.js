'use strict';

var dataSource,
  config,
  testHelper = require('./TestHelper'),
  service = require('../server/services/ChallengeService'),
  assert = require('assert'),
  /**
   * Id to store challenge ID for register and get single test
   */
  id,

  /**
   * sample entities to be used for testcases
   * @type {Object}
   */
  challenge1 = require('./challenge1.json'),
  challenge2 = require('./challenge2.json');


describe('Test. ChallengeService', function() {
  // Initializes test variables
  before(function(done) {
    testHelper.init(function() {
      config = testHelper.getConfig();
      dataSource = testHelper.getDataSource();
      done();
    });
  });

  /**
   * Test for add challenges
   */
  describe('#AddChallenge', function() {
    /**
     * Callback argument should be a function. This test will fail
     * @param  {Function}  done       done function
     */
    it('callback should be function', function (done) {
      try {
        service.createChallenge(challenge1);
        //not done here
      } catch (err) {
        assert.ok(err);
        done();
      }
    });

    /**
     * Successful create
     */
    it('Successful Create 1', function(done) {
      service.createChallenge(challenge1, function(err, challenge) {
        assert.ifError(err);
        assert.ok(challenge);
        done();
      });
    });

    /**
     * Successful create
     */
    it('Successful Create 2', function(done) {
      service.createChallenge(challenge2, function(err, challenge) {
        assert.ifError(err);
        assert.ok(challenge);
        done();
      });
    });

  });

  /**
   * Tests for get challenges
   */
  describe('#GetChallenges', function() {
    /**
     * Get all Test. Search criteria is an empty object
     */
    it('Gell All Success', function(done) {
      service.getAll({}, function(err, challenges) {
        assert.ifError(err);
        id = challenges[0].id;
        // The length of entities should be 3 as three changlles are created in Add challenge test
        assert.equal(2, challenges.length);
        done();
      });
    });

    /**
     * Get single
     */
    it('Get Single', function(done) {
      service.getSingle(id, function(err, challenge) {
        assert.ifError(err);
        assert.ok(challenge);
        done();
      });
    });
    
    /**
     * Search Challenges
     */
    it('Search challenges', function(done) {
      var searchCriteria = {
        status : 'Registration',
        tags : [
          'API'
        ]
      };
      service.getAll(searchCriteria, function(err, challenges) {
        assert.ifError(err);
        assert.ok(challenges);
        done();
      });
    });

    /**
     * Callback should be a function
     */
    it('callback should be function', function (done) {
      try {
        service.createChallenge(challenge1);
        //not done here
      } catch (err) {
        assert.ok(err);
        done();
      }
    });

  });

  describe('#RegisterForChallenge', function() {

    /**
     * Callback should be a function
     */
    it('callback should be function', function (done) {
      try {
        service.register(id, 1);
        //not done here
      } catch (err) {
        assert.ok(err);
        done();
      }
    });

    /**
     * Successful registration
     */
    it('Successful registration', function(done) {
      /**
       * Registering 1 is any demo user id. Can be anything
       */
      service.register(id, 1, function(err, result) {
        assert.ifError(err);
        assert.ok(result);
        done();
      });
    });

  });

});