/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
/**
 * This module contains codes for testing Submission model.
 *
 * @version 1.0
 * @author peakpado
 */
'use strict';

/**
 * Submission model test.
 */
var should = require('should');
var config = require('config');
var datasource = require('./../../datasource');
datasource.init(config);
var db = datasource.getDataSource();
var sequelize = db.sequelize;
sequelize.options.logging = false;   // turn of sequelize logging.
var Submission = db.Submission;


/**
 * Globals
 */
var data;
var entity;

/**
 * Test Submission model CRUD operations
 */
describe('<Unit Test>', function() {
  this.timeout(15000);
  describe('Model Submission:', function() {
    beforeEach(function(done) {
      data = {
        challengeId: 111,
        submitterId: 222,
        submitterHandle: 'submitter_handle',
        status:'VALID',
        createdBy: 1,
        updatedBy: 1
      };
      done();
    });

    describe('Method Save', function() {
      it('should able to save without problems', function(done) {
        // create a entity
        Submission.create(data).success(function(savedEntity) {
          savedEntity.id.should.be.a.Number;
          savedEntity.id.should.not.have.length(0);
          savedEntity.createdAt.should.not.have.length(0);
          savedEntity.updatedAt.should.not.have.length(0);
          savedEntity.challengeId.should.equal(data.challengeId);
          savedEntity.submitterId.should.equal(data.submitterId);
          savedEntity.submitterHandle.should.equal(data.submitterHandle);
          savedEntity.status.should.equal(data.status);
          savedEntity.createdBy.should.equal(data.createdBy);
          savedEntity.updatedBy.should.equal(data.updatedBy);
          done();
        })
        .error(function(err) {
          should.not.exist(err);
          done();
        });
      });

      it('should fail when try to save without challengeId', function(done) {
        delete data.challengeId;
        // create a entity
        Submission.create(data).success(function(savedEntity) {
          should.not.exist(savedEntity);
          done();
        })
        .error(function(err) {
          should.exist(err);
          done();
        });
      });

      it('should fail when try to save without a status', function(done) {
        delete data.status;
        // create a entity
        Submission.create(data).success(function(savedEntity) {
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
        Submission.create(data).success(function(savedEntity) {
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
        Submission.create(data).success(function(savedEntity) {
          entity = savedEntity;
          done();
        });
      });

      it('should able to find all submissions', function(done) {
        // find all entities
        Submission.findAll().success(function(allEntities) {
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
        Submission.find(entity.id).success(function(retrievedEntity) {
          retrievedEntity.id.should.equal(entity.id);
          retrievedEntity.challengeId.should.equal(entity.challengeId);
          retrievedEntity.submitterId.should.equal(entity.submitterId);
          done();
        })
        .error(function(err) {
          should.not.exist(err);
          done();
        });
      });

      it('should not able to find a submission with invalid id', function(done) {
        // get an entity
        Submission.find(999999).success(function(retrievedEntity) {
          should.not.exist(retrievedEntity);
          done();
        })
        .error(function(err) {
          should.exist(err);
          done();
        });
      });

      it('should able to update a submission with valid id', function(done) {
        entity.submitterId = 5555;
        // update an entity
        entity.save().success(function(updatedEntity) {
          updatedEntity.id.should.equal(entity.id);
          updatedEntity.submitterId.should.equal(entity.submitterId);
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
