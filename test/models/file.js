/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
/**
 * This module contains codes for testing File model.
 *
 * @version 1.0
 * @author peakpado
 */
'use strict';

/**
 * File model test.
 */
var should = require('should');
var config = require('config');
var datasource = require('./../../datasource');
datasource.init(config);
var db = datasource.getDataSource();
var sequelize = db.sequelize;
sequelize.options.logging = false;   // turn of sequelize logging.
var File = db.File;
var Challenge = db.Challenge;


/**
 * Globals
 */
var data;
var entity;
var challengeData;
var savedChallenge;

/**
 * Test File model CRUD operations
 */
describe('<Unit Test>', function() {
  this.timeout(15000);
  describe('Model File:', function() {
    beforeEach(function(done) {
      data = {
        title: 'File Title',
        size: 123,
        storageLocation: 'local',
        fileUrl: '/uploads/my-submission.zip',
        createdBy: 1,
        updatedBy: 1
      };
      challengeData = {
        title: 'Challenge Title',
        overview: '<p>Challenge Overview</p>',
        description: 'long description',
        regStartAt: '2014-08-13',
        subEndAt: '2014-08-18',
        status: 'DRAFT',
        tags: ['tag1', 'tag2'],
        prizes: [500.00,150.00],
        createdBy: 1,
        updatedBy: 1,
        projectId: "PROJECT1",
        projectSource: "TOPCODER",
        creatorHandle: "CREATOR",
        creatorId: "111"
      };

      Challenge.create(challengeData).success(function(savedEntity) {
        data.challengeId = savedEntity.id;
        savedChallenge = savedEntity;
        done();
      });
    });

    describe('Method Save', function() {
      it('should able to save without problems', function(done) {
        // create a entity
        File.create(data).success(function(savedEntity) {
          savedEntity.id.should.be.a.Number;
          savedEntity.id.should.not.have.length(0);
          savedEntity.createdAt.should.not.have.length(0);
          savedEntity.updatedAt.should.not.have.length(0);
          savedEntity.title.should.equal(data.title);
          savedEntity.fileUrl.should.equal(data.fileUrl);
          savedEntity.size.should.equal(data.size);
          savedEntity.createdBy.should.equal(data.createdBy);
          savedEntity.updatedBy.should.equal(data.updatedBy);
          done();
        })
        .error(function(err) {
          should.not.exist(err);
          done();
        });
      });

      it('should fail when try to save without fileUrl', function(done) {
        delete data.fileUrl;
        // create a entity
        File.create(data).success(function(savedEntity) {
          should.not.exist(savedEntity);
          done();
        })
        .error(function(err) {
          should.exist(err);
          done();
        });
      });

      it('should be able to save any storageLocation', function(done) {
        data.storageLocation = 'invalid-location';
        // create a entity
        File.create(data).success(function(savedEntity) {
          savedEntity.id.should.be.a.Number;
          savedEntity.id.should.not.have.length(0);
          savedEntity.createdAt.should.not.have.length(0);
          savedEntity.updatedAt.should.not.have.length(0);
          savedEntity.title.should.equal(data.title);
          savedEntity.fileUrl.should.equal(data.fileUrl);
          savedEntity.size.should.equal(data.size);
          savedEntity.storageLocation.should.equal(data.storageLocation);
          savedEntity.createdBy.should.equal(data.createdBy);
          savedEntity.updatedBy.should.equal(data.updatedBy);
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
        File.create(data).success(function(savedEntity) {
          entity = savedEntity;
          done();
        });
      });

      it('should able to find all files', function(done) {
        // find all entities
        File.findAll().success(function(allEntities) {
          allEntities.length.should.be.greaterThan(0);
          done();
        })
        .error(function(err) {
          should.not.exist(err);
          done();
        });
      });

      it('should able to find a file with valid id', function(done) {
        // get an entity
        File.find(entity.id).success(function(retrievedEntity) {
          retrievedEntity.id.should.equal(entity.id);
          retrievedEntity.title.should.equal(entity.title);
          retrievedEntity.fileUrl.should.equal(entity.fileUrl);
          retrievedEntity.size.should.equal(entity.size);
          done();
        })
        .error(function(err) {
          should.not.exist(err);
          done();
        });
      });

      it('should not able to find a file with invalid id', function(done) {
        // get an entity
        File.find(999999).success(function(retrievedEntity) {
          should.not.exist(retrievedEntity);
          done();
        })
        .error(function(err) {
          should.exist(err);
          done();
        });
      });

      it('should able to update a file with valid id', function(done) {
        entity.title = 'File Modified';
        // update an entity
        entity.save().success(function(updatedEntity) {
          updatedEntity.id.should.equal(entity.id);
          updatedEntity.title.should.equal(entity.title);
          done();
        })
        .error(function(err) {
          should.not.exist(err);
          done();
        });
      });

      it('should able to delete a file', function(done) {
        // delete an entity
        entity.destroy().success(function() {
          done();
        })
        .error(function(err) {
          should.not.exist(err);
          done();
        });
      });

      it('should failed to get the nested file after the draft challenge deleted', function(done){
        File.create(data).success(function(savedEntity) {
          entity = savedEntity;
          savedChallenge.destroy().success(function(){
            File.find(entity.id).success(function(retrievedEntity) {
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
