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
      get: function() {
        return parseInt(this.getDataValue('challengeId'));
      }
    },
    // user id of submitter
    submitterId : {
      type: DataTypes.BIGINT, allowNull: false,
      get: function() {
        return parseInt(this.getDataValue('submitterId'));
      }
    },
    status: {
        type: DataTypes.ENUM,
        values: ['VALID','INVALID','LATE']
    },
    createdBy: {
      type: DataTypes.BIGINT,
      get: function() {
        return parseInt(this.getDataValue('createdBy'));
      }
    },
    updatedBy: {
      type: DataTypes.BIGINT,
      get: function() {
        return parseInt(this.getDataValue('updatedBy'));
      }
    }
  }, {
    tableName : 'submissions',
    associate : function(models) {
      Submission.hasMany(models.File);
      Submission.hasMany(models.Scorecard);
      Submission.belongsTo(models.Challenge, {foreignKey : 'challengeId'});
    }
  });

  return Submission;

};