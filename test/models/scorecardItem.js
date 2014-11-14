/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
/**
 * This module contains codes for testing ScorecardItem model.
 *
 * @version 1.0
 * @author peakpado
 */
'use strict';

/**
 * ScorecardItem model test.
 */
var should = require('should');
var config = require('config');
var datasource = require('./../../datasource');
datasource.init(config);
var db = datasource.getDataSource();
var sequelize = db.sequelize;
sequelize.options.logging = false;   // turn of sequelize logging.
var ScorecardItem = db.ScorecardItem;


var SAMPLE_TEXT_10 = '1234567890';

/**
 * Globals
 */
var data;
var entity;

/**
 * Test ScorecardItem model CRUD operations
 */
describe('<Unit Test>', function() {
  describe('Model ScorecardItem:', function() {
    beforeEach(function(done) {
      data = {
        score: 98,
        scorecardId: 111,
        requirementId: 222,
        requirementText: 'video is required',
        comment: 'excellent job',
        createdBy: 1,
        updatedBy: 1
      };
      done();
    });

    describe('Method Save', function() {
      it('should able to save without problems', function(done) {
        // create a entity
        ScorecardItem.create(data).success(function(savedEntity) {
          savedEntity.id.should.be.a.Number;
          savedEntity.id.should.not.have.length(0);
          savedEntity.createdAt.should.not.have.length(0);
          savedEntity.updatedAt.should.not.have.length(0);
          savedEntity.score.should.equal(data.score);
          savedEntity.requirementId.should.equal(data.requirementId);
          savedEntity.comment.should.equal(data.comment);
          savedEntity.createdBy.should.equal(data.createdBy);
          savedEntity.updatedBy.should.equal(data.updatedBy);
          done();
        })
        .error(function(err) {
          should.not.exist(err);
          done();
        });
      });

      it('should fail when try to save without scorecardId', function(done) {
        delete data.scorecardId;
        // create a entity
        ScorecardItem.create(data).success(function(savedEntity) {
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
        ScorecardItem.create(data).success(function(savedEntity) {
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
        ScorecardItem.create(data).success(function(savedEntity) {
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
        ScorecardItem.create(data).success(function(savedEntity) {
          entity = savedEntity;
          done();
        });
      });

      it('should able to find all scorecard items', function(done) {
        // find all entities
        ScorecardItem.findAll().success(function(allEntities) {
          allEntities.length.should.be.greaterThan(0);
          done();
        })
        .error(function(err) {
          should.not.exist(err);
          done();
        });
      });

      it('should able to find a scorecard item with valid id', function(done) {
        // get an entity
        ScorecardItem.find(entity.id).success(function(retrievedEntity) {
          retrievedEntity.id.should.equal(entity.id);
          retrievedEntity.requirementId.should.equal(entity.requirementId);
          retrievedEntity.comment.should.equal(entity.comment);
          done();
        })
        .error(function(err) {
          should.not.exist(err);
          done();
        });
      });

      it('should not able to find a scorecard item with invalid id', function(done) {
        // get an entity
        ScorecardItem.find(999999).success(function(retrievedEntity) {
          should.not.exist(retrievedEntity);
          done();
        })
        .error(function(err) {
          should.exist(err);
          done();
        });
      });

      it('should able to update a scorecard item with valid id', function(done) {
        entity.comment = 'Updated comment';
        // update an entity
        entity.save().success(function(updatedEntity) {
          updatedEntity.id.should.equal(entity.id);
          updatedEntity.comment.should.equal(entity.comment);
          done();
        })
        .error(function(err) {
          should.not.exist(err);
          done();
        });
      });

      it('should able to delete a scorecard item', function(done) {
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
