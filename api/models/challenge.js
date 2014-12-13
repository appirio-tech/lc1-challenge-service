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
    regStartAt: DataTypes.DATE,
    // submission end date
    subEndAt: DataTypes.DATE,
    // challenge completed date
    completedAt: DataTypes.DATE,
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
    description: DataTypes.TEXT,
    source: DataTypes.TEXT,
    sourceId: DataTypes.TEXT,
    creatorHandle: DataTypes.STRING(128),
    creatorId: DataTypes.BIGINT,
    tags: DataTypes.ARRAY(DataTypes.TEXT),
    prizes: DataTypes.ARRAY(DataTypes.DOUBLE),
    // the phase status of challenge
    status : {
      type: DataTypes.ENUM,
      values: ['DRAFT', 'SUBMISSION', 'REVIEW', 'COMPLETE']
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
    },
    projectId: DataTypes.STRING(255),
    projectSource: {
        type: DataTypes.ENUM,
        values: ['TOPCODER']
    }
  }, {
    tableName : 'challenges',
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
