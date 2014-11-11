/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
/**
 * Represent Submission in the system.
 *
 * @version 1.0
 * @author peakpado
 */
'use strict';

/**
* Defining Submission model
*/
module.exports = function(sequelize, DataTypes) {
  var Submission = sequelize.define('Submission', {
    // primary key
    id: {
      type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true,
      get: function() {
        return parseInt(this.getDataValue('id'));
      }
    },
    challengeId : {
      type: DataTypes.BIGINT, allowNull: false,
      field: 'challenge_id',
      get: function() {
        return parseInt(this.getDataValue('challengeId'));
      }
    },
    // user id of submitter
    submitterId : {
      type: DataTypes.BIGINT, allowNull: false,
      field: 'submitter_id',
      get: function() {
        return parseInt(this.getDataValue('submitterId'));
      }
    },
    createdBy: {
      type: DataTypes.STRING(128),
      field: 'created_by'
    },
    updatedBy: {
      type: DataTypes.STRING(128),
      field: 'updated_by'
    }
  }, {
    tableName : 'submissions',
    underscored: true,
    associate : function(models) {
      Submission.hasMany(models.File);
      Submission.hasMany(models.Scorecard);
      Submission.belongsTo(models.User, {foreignKey : 'submitter_id'});
      Submission.belongsTo(models.Challenge, {foreignKey : 'challenge_id'});
    },
    getterMethods: {
      // FIXME
      // due to sequelize 1.7 bugfix or 2.0 release we must use getters createdAt and updatedAt
      createdAt: function() {
        return this.getDataValue('created_at');
      },
      updatedAt: function() {
        return this.getDataValue('updated_at');
      }
    }
  });

  return Submission;

};