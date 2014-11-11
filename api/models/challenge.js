/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
/**
 * Represent Challenge in the system.
 *
 * @version 1.0
 * @author peakpado
 */
'use strict';

/**
* Defining Challenge model
*/
module.exports = function(sequelize, DataTypes) {

  var Challenge = sequelize.define('Challenge', {
    // primary key
    id: {
      type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true,
      get: function() {
        return parseInt(this.getDataValue('id'));
      }
    },
    // registration start date
    regStartAt: {
      type: DataTypes.DATE,
      field: 'reg_start_at'
    },
    // submission end date
    subEndAt: {
      type: DataTypes.DATE,
      field: 'sub_end_at'
    },
    // challenge completed date
    completedAt: {
      type: DataTypes.DATE,
      field: 'completed_at'
    },
    // challenge title
    title: {
      type: DataTypes.TEXT,
      defaultValue: 'Untitled Challenge',
      allowNull: false,
      validate: {
        min: 1
      }
    },
    overview: DataTypes.STRING(140),
    account: DataTypes.STRING(255),
    accountId: {
      type: DataTypes.STRING(255),
      field: 'account_id'
    },
    description: DataTypes.TEXT,
    source: DataTypes.TEXT,
    sourceId: {
      type: DataTypes.TEXT,
      field: 'source_id'
    },
    tags: DataTypes.ARRAY(DataTypes.TEXT),
    prizes: DataTypes.ARRAY(DataTypes.FLOAT),
    // the phase status of challenge
    status : {
      type: DataTypes.ENUM,
      values: ['DRAFT', 'SUBMISSION', 'REVIEW', 'COMPLETE']
    },
    createdBy: {
      type: DataTypes.STRING(128),
      field: 'created_by'
    },
    updatedBy: {
      type: DataTypes.STRING(128),
      field: 'updated_by'
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at'
    }
  }, {
    tableName : 'challenges',
    underscore: true,
    associate : function(models) {
      Challenge.hasMany(models.File);
      Challenge.hasMany(models.Participant);
      Challenge.hasMany(models.Submission);
      Challenge.hasMany(models.Scorecard);
      Challenge.hasMany(models.Requirement);
    }
  });

  return Challenge;

};
