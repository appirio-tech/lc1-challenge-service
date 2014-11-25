/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
/**
 * This module contains codes for testing Participant model.
 *
 * @version 1.0
 * @author peakpado
 */
'use strict';

/**
 * Participant model test.
 */
var should = require('should');
var config = require('config');
var datasource = require('./../../datasource');
datasource.init(config);
var db = datasource.getDataSource();
var sequelize = db.sequelize;
sequelize.options.logging = false;   // turn of sequelize logging.
var Participant = db.Participant;


/**
 * Globals
 */
var data;
var entity;

/**
 * Test Participant model CRUD operations
 */
describe('<Unit Test>', function() {
  describe('Model Participant:', function() {
    beforeEach(function(done) {
      data = {
        role: 'SUBMITTER',
        challengeId: 111,
        userId: 222,
        userHandle: 'user_handle',
        createdBy: 1,
        updatedBy: 1
      };
      done();
    });

    describe('Method Save', function() {
      it('should able to save without problems', function(done) {
        // create a entity
        Participant.create(data).success(function(savedEntity) {
          savedEntity.id.should.be.a.Number;
          savedEntity.id.should.not.have.length(0);
          savedEntity.createdAt.should.not.have.length(0);
          savedEntity.updatedAt.should.not.have.length(0);
          savedEntity.role.should.equal(data.role);
          savedEntity.challengeId.should.equal(data.challengeId);
          savedEntity.userId.should.equal(data.userId);
          savedEntity.userHandle.should.equal(data.userHandle);
          savedEntity.createdBy.should.equal(data.createdBy);
          savedEntity.updatedBy.should.equal(data.updatedBy);
          done();
        })
        .error(function(err) {
          should.not.exist(err);
          done();
        });
      });

      it('should fail when try to save without role', function(done) {
        delete data.role;
        // create a entity
        Participant.create(data).success(function(savedEntity) {
          should.not.exist(savedEntity);
          done();
        })
        .error(function(err) {
          should.exist(err);
          done();
        });
      });

      it('should fail when try to save with an invalid role', function(done) {
        data.role = 'invalid-role';
        // create a entity
        Participant.create(data).success(function(savedEntity) {
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
        Participant.create(data).success(function(savedEntity) {
          entity = savedEntity;
          done();
        });
      });

      it('should able to find all participants', function(done) {
        // find all entities
        Participant.findAll().success(function(allEntities) {
          allEntities.length.should.be.greaterThan(0);
          done();
        })
        .error(function(err) {
          should.not.exist(err);
          done();
        });
      });

      it('should able to find a participant with valid id', function(done) {
        // get an entity
        Participant.find(entity.id).success(function(retrievedEntity) {
          retrievedEntity.id.should.equal(entity.id);
          retrievedEntity.role.should.equal(entity.role);
          retrievedEntity.challengeId.should.equal(entity.challengeId);
          done();
        })
        .error(function(err) {
          should.not.exist(err);
          done();
        });
      });

      it('should not able to find a participant with invalid id', function(done) {
        // get an entity
        Participant.find(999999).success(function(retrievedEntity) {
          should.not.exist(retrievedEntity);
          done();
        })
        .error(function(err) {
          should.exist(err);
          done();
        });
      });

      it('should able to update a participant with valid id', function(done) {
        entity.role = 'REVIEWER';
        // update an entity
        entity.save().success(function(updatedEntity) {
          updatedEntity.id.should.equal(entity.id);
          updatedEntity.role.should.equal(entity.role);
          done();
        })
        .error(function(err) {
          should.not.exist(err);
          done();
        });
      });

      it('should able to delete a participant', function(done) {
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
