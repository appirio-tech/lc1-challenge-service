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
    account: DataTypes.STRING(255),
    accountId: DataTypes.STRING(255),
    description: DataTypes.TEXT,
    source: DataTypes.TEXT,
    sourceId: DataTypes.TEXT,
    tags: DataTypes.ARRAY(DataTypes.TEXT),
    prizes: DataTypes.ARRAY(DataTypes.DOUBLE),
    // the phase status of challenge
    status : {
      type: DataTypes.ENUM,
      values: ['DRAFT', 'SUBMISSION', 'REVIEW', 'COMPLETE']
    },
    createdBy: {
      type: DataTypes.BIGINT, allowNull: false,
      get: function() {
        return parseInt(this.getDataValue('createdBy'));
      }
    },
    updatedBy: {
      type: DataTypes.BIGINT, allowNull: false,
      get: function() {
        return parseInt(this.getDataValue('updatedBy'));
      }
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
