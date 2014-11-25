/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
/**
 * This module contains codes for testing Challenge model.
 *
 * @version 1.0
 * @author peakpado
 */
'use strict';

/**
 * Challenge model test.
 */
var should = require('should');
var config = require('config');
var datasource = require('./../../datasource');
datasource.init(config);
var db = datasource.getDataSource();
var sequelize = db.sequelize;
sequelize.options.logging = false;   // turn of sequelize logging.
var Challenge = db.Challenge;


var SAMPLE_TEXT_10 = '1234567890';

/**
 * Globals
 */
var data;
var entity;

/**
 * Test Challenge model CRUD operations
 */
describe('<Unit Test>', function () {
  describe('Model Challenge:', function () {
    beforeEach(function (done) {
      // challenge data
      data = {
        title: 'Challenge Title',
        overview: '<p>Challenge Overview</p>',
        description: 'long description',
        regStartAt: '2014-08-13',
        subEndAt: '2014-08-18',
        status: 'SUBMISSION',
        tags: ['tag1', 'tag2'],
        prizes: [500.00, 150.00],
        createdBy: 1,
        updatedBy: 1,
        projectId: "PROJECT1",
        projectSource: "TOPCODER"
      };
      done();
    });

    describe('Method Save', function () {
      it('should able to save without problems', function (done) {
        // create a entity
        Challenge.create(data).success(function (savedEntity) {
          savedEntity.id.should.be.a.Number;
          savedEntity.id.should.not.have.length(0);
          savedEntity.createdAt.should.not.have.length(0);
          savedEntity.updatedAt.should.not.have.length(0);
          savedEntity.title.should.equal(data.title);
          savedEntity.overview.should.equal(data.overview);
          savedEntity.status.should.equal(data.status);
          savedEntity.createdBy.should.equal(data.createdBy);
          savedEntity.updatedBy.should.equal(data.updatedBy);
          savedEntity.projectId.should.equal(data.projectId);
          savedEntity.projectSource.should.equal(data.projectSource);
          done();
        })
          .error(function (err) {
            should.not.exist(err);
            done();
          });
      });

      it('should fail when try to save a overview of more than 140 chars', function (done) {
        for (var i = 0; i < 15; i += 1) {
          data.overview += SAMPLE_TEXT_10;
        }
        // create an entity
        Challenge.create(data).success(function (savedEntity) {
          should.not.exist(savedEntity);
          done();
        })
          .error(function (err) {
            should.exist(err);
            done();
          });
      });

    });

    describe('Method Find/Update/Delete', function () {
      beforeEach(function (done) {
        // create a entity
        Challenge.create(data).success(function (savedEntity) {
          entity = savedEntity;
          done();
        });
      });

      it('should able to find all challenges', function (done) {
        // find all entities
        Challenge.findAll().success(function (allEntities) {
          allEntities.length.should.be.greaterThan(0);
          done();
        })
          .error(function (err) {
            should.not.exist(err);
            done();
          });
      });

      it('should able to find a challenge with valid id', function (done) {
        // get an entity
        Challenge.find(entity.id).success(function (retrievedEntity) {
          retrievedEntity.id.should.equal(entity.id);
          retrievedEntity.title.should.equal(entity.title);
          retrievedEntity.overview.should.equal(entity.overview);
          done();
        })
          .error(function (err) {
            should.not.exist(err);
            done();
          });
      });


      it('should not able to find a challenge with invalid id', function (done) {
        // get an entity
        Challenge.find(999999).success(function (retrievedEntity) {
          should.not.exist(retrievedEntity);
          done();
        })
          .error(function (err) {
            should.exist(err);
            done();
          });
      });

      it('should able to update a challenge with valid id', function (done) {
        entity.title = 'Challenge Modified';
        // update an entity
        entity.save().success(function (updatedEntity) {
          updatedEntity.id.should.equal(entity.id);
          updatedEntity.title.should.equal('Challenge Modified');
          done();
        })
          .error(function (err) {
            should.not.exist(err);
            done();
          });
      });

      it('should able to delete a challenge', function (done) {
        // delete an entity
        entity.destroy().success(function () {
          done();
        })
          .error(function (err) {
            should.not.exist(err);
            done();
          });
      });

    });

    afterEach(function (done) {
      if (entity) {
        entity.destroy().success(function () {
          entity = undefined;
          done();
        })
          .error(function (err) {
            done(err);
          });
      } else {
        done();
      }

    });
  });
});
