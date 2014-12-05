/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
/**
 * This module contains codes for testing Requirement model.
 *
 * @version 1.0
 * @author spanhawk
 */
'use strict';

/**
 * Requirement model test.
 */
var should = require('should');
var config = require('config');
var datasource = require('./../../datasource');
datasource.init(config);
var _ = require('lodash');
var db = datasource.getDataSource();
var sequelize = db.sequelize;
sequelize.options.logging = false;   // turn of sequelize logging.
var Requirement = db.Requirement;
var Challenge = db.Challenge;

/**
 * Globals
 */
var data;
var entity;
var challenge;

/**
 * Test Requirement model CRUD operations
 */
describe('<Unit Test>', function() {
  this.timeout(15000);
  // create a challenge.
  var challengeData = {
    title: 'Challenge Title',
    overview: '<p>Challenge Overview</p>',
    description: 'long description',
    regStartAt: '2014-08-13',
    subEndAt: '2014-08-18',
    status: 'SUBMISSION',
    tags: ['tag1', 'tag2'],
    prizes: [500.00,150.00],
    createdBy: 1,
    updatedBy: 1
  };

  before(function(done) {
    Challenge.create(challengeData).success(function(savedEntity) {
      challenge = savedEntity;
      savedEntity.id.should.be.a.Number;
      savedEntity.id.should.not.have.length(0);
      savedEntity.createdAt.should.not.have.length(0);
      savedEntity.updatedAt.should.not.have.length(0);
      savedEntity.title.should.equal(challengeData.title);
      savedEntity.overview.should.equal(challengeData.overview);
      savedEntity.status.should.equal(challengeData.status);
      done();
    });
  });

  describe('Model Requirement:', function() {
    beforeEach(function(done) {
      // requirement data
      data = {
        challengeId: challenge.id,
        requirementText: 'some text'
      };
      done();
    });

    describe('Method Save', function() {
      it('should able to save without problems', function(done) {
        // create a entity
        Requirement.create(data).success(function(savedEntity) {
          entity = savedEntity;
          savedEntity.id.should.be.a.Number;
          savedEntity.id.should.not.have.length(0);
          savedEntity.challengeId.should.be.a.Number;
          savedEntity.challengeId.should.not.have.length(0);
          savedEntity.createdAt.should.not.have.length(0);
          savedEntity.updatedAt.should.not.have.length(0);
          savedEntity.requirementText.should.equal(data.requirementText);
          done();
        })
        .error(function(err) {
          should.not.exist(err);
          done();
        });
      });

      it('should fail when try to save without challengeId', function(done) {
        var data = _.omit(data, 'challengeId');
        // create an entity
        Requirement.create(data).success(function(savedEntity) {
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
        Requirement.create(data).success(function(savedEntity) {
          entity = savedEntity;
          done();
        });
      });

      it('should able to find all requirements', function(done) {
        // find all entities
        Requirement.findAll().success(function(allEntities) {
          allEntities.length.should.be.greaterThan(0);
          done();
        })
        .error(function(err) {
          should.not.exist(err);
          done();
        });
      });

      it('should able to find a requirement with valid id', function(done) {
        // get an entity
        Requirement.find(entity.id).success(function(retrievedEntity) {
          retrievedEntity.id.should.equal(entity.id);
          retrievedEntity.requirementText.should.equal(entity.requirementText);
          done();
        })
        .error(function(err) {
          should.not.exist(err);
          done();
        });
      });


      it('should not able to find a requirement with invalid id', function(done) {
        // get an entity
        Requirement.find(999999).success(function(retrievedEntity) {
          should.not.exist(retrievedEntity);
          done();
        })
        .error(function(err) {
          should.exist(err);
          done();
        });
      });

      it('should able to update a requirement with valid id', function(done) {
        entity.requirementText = 'Requirement Modified';
        // update an entity
        entity.save().success(function(updatedEntity) {
          updatedEntity.id.should.equal(entity.id);
          updatedEntity.requirementText.should.equal('Requirement Modified');
          done();
        })
        .error(function(err) {
          should.not.exist(err);
          done();
        });
      });

      it('should able to delete a requirement', function(done) {
        // delete an entity
        entity.destroy().success(function() {
          done();
        })
        .error(function(err) {
          should.not.exist(err);
          done();
        });
      });

      it('should failed to get the nested participant after the draft challenge deleted', function(done){
        Requirement.create(data).success(function(savedEntity) {
          entity = savedEntity;
          challenge.destroy().success(function(){
            Requirement.find(entity.id).success(function(retrievedEntity) {
              should.not.exist(retrievedEntity);
              done();
            })
            .error(function(err) {
              should.exist(err);
              done();
            });
          })
          .error(function(err){
            should.not.exist(err);
            done();
          });
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
