/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
/**
 * This module contains codes for testing Scorecard model.
 *
 * @version 1.0
 * @author peakpado
 */
'use strict';

/**
 * Scorecard model test.
 */
var should = require('should');
var config = require('config');
var datasource = require('./../../datasource');
datasource.init(config);
var db = datasource.getDataSource();
var sequelize = db.sequelize;
sequelize.options.logging = false;   // turn of sequelize logging.
var Scorecard = db.Scorecard;


/**
 * Globals
 */
var data;
var entity;

/**
 * Test Scorecard model CRUD operations
 */
describe('<Unit Test>', function() {
  describe('Model Scorecard:', function() {
    beforeEach(function(done) {
      data = {
        scoreSum: 97,
        scorePercent: 96.5,
        scoreMax: 99.9,
        status: 'NEW',
        pay: false,
        place: 1,
        prize: 1500,
        challengeId: 111,
        reviewerId: 222,
        submissionId: 333,
        createdBy: 1,
        updatedBy: 1
      };
      done();
    });

    describe('Method Save', function() {
      it('should able to save without problems', function(done) {
        // create a entity
        Scorecard.create(data).success(function(savedEntity) {
          savedEntity.id.should.be.a.Number;
          savedEntity.id.should.not.have.length(0);
          savedEntity.createdAt.should.not.have.length(0);
          savedEntity.updatedAt.should.not.have.length(0);
          savedEntity.scoreSum.should.equal(data.scoreSum);
          savedEntity.status.should.equal(data.status);
          savedEntity.submissionId.should.equal(data.submissionId);
          savedEntity.createdBy.should.equal(data.createdBy);
          savedEntity.updatedBy.should.equal(data.updatedBy);
          done();
        })
        .error(function(err) {
          should.not.exist(err);
          done();
        });
      });

      it('should fail when try to save without submissionId', function(done) {
        delete data.submissionId;
        // create a entity
        Scorecard.create(data).success(function(savedEntity) {
          should.not.exist(savedEntity);
          done();
        })
        .error(function(err) {
          should.exist(err);
          done();
        });
      });

      it('should fail when try to save with an invalid status', function(done) {
        data.status = 'invalid-status';
        // create a entity
        Scorecard.create(data).success(function(savedEntity) {
          should.not.exist(savedEntity);
          done();
        })
        .error(function(err) {
          should.exist(err);
          done();
        });
      });

      it('should fail when try to save without `updatedBy` field', function(done) {
        delete data.updatedBy;
        // create an entity
        Scorecard.create(data).success(function(savedEntity) {
          should.not.exist(savedEntity);
          done();
        })
        .error(function(err) {
          should.exist(err);
          done();
        });
      });

      it('should fail when try to save without `createdBy` field', function(done) {
        delete data.createdBy;
        // create an entity
        Scorecard.create(data).success(function(savedEntity) {
          should.not.exist(savedEntity);
          done();
        })
        .error(function(err) {
          should.exist(err);
          done();
        });
      });

    });

    describe('Method Find/Update/Delete', function() {
      beforeEach(function(done) {
        // create a entity
        Scorecard.create(data).success(function(savedEntity) {
          entity = savedEntity;
          done();
        });
      });

      it('should able to find all submissions', function(done) {
        // find all entities
        Scorecard.findAll().success(function(allEntities) {
          allEntities.length.should.be.greaterThan(0);
          done();
        })
        .error(function(err) {
          should.not.exist(err);
          done();
        });
      });

      it('should able to find a submission with valid id', function(done) {
        // get an entity
        Scorecard.find(entity.id).success(function(retrievedEntity) {
          retrievedEntity.id.should.equal(entity.id);
          retrievedEntity.submissionId.should.equal(entity.submissionId);
          retrievedEntity.status.should.equal(entity.status);
          done();
        })
        .error(function(err) {
          should.not.exist(err);
          done();
        });
      });

      it('should not able to find a submission with invalid id', function(done) {
        // update an entity
        Scorecard.find(999999).success(function(retrievedEntity) {
          should.not.exist(retrievedEntity);
          done();
        })
        .error(function(err) {
          should.exist(err);
          done();
        });
      });

      it('should able to update a submission with valid id', function(done) {
        entity.status = 'SAVED';
        // update an entity
        entity.save().success(function(updatedEntity) {
          updatedEntity.id.should.equal(entity.id);
          updatedEntity.status.should.equal(entity.status);
          done();
        })
        .error(function(err) {
          should.not.exist(err);
          done();
        });
      });

      it('should able to delete a submission', function(done) {
        // delete an entity
        entity.destroy().success(function() {
          done();
        })
        .error(function(err) {
          should.not.exist(err);
          done();
        });
      });

    });

    afterEach(function(done) {
      if (entity) {
        entity.destroy().success(function() {
          entity = undefined;
          done();
        })
        .error(function(err){
          done(err);
        });
      } else {
        done();
      }

    });
  });
});
