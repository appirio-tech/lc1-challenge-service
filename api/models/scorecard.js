/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
/**
 * Represent Scorecard in the system.
 *
 * @version 1.0
 * @author peakpado
 */
'use strict';

/**
* Defining Scorecard model
*/
module.exports = function(sequelize, DataTypes) {

  var Scorecard = sequelize.define('Scorecard', {
    // primary key
    id: {
      type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true,
      get: function() {
        return parseInt(this.getDataValue('id'));
      }
    },
    challengeId: {
      type: DataTypes.BIGINT, allowNull: false,
      field: 'challenge_id',
      get: function() {
        return parseInt(this.getDataValue('challengeId'));
      }
    },
    // user id of reviewer
    reviewerId: {
      type: DataTypes.BIGINT,
      field: 'reviewer_id',
      get: function() {
        return parseInt(this.getDataValue('reviewerId'));
      }
    },
    submissionId: {
      type: DataTypes.BIGINT,
      field: 'submission_id',
      get: function() {
        return parseInt(this.getDataValue('submissionId'));
      }
    },
    // sum of all the scorecard items scorecard
    scoreSum: {
      type: DataTypes.INTEGER,
      field: 'score_sum'
    },
    // scoreSum / scoreMax from scorecard items
    scorePercent: {
      type: DataTypes.FLOAT,
      field: 'score_percent'
    },
    // sum of highest possible score from scorecard items
    scoreMax: {
      type: DataTypes.FLOAT,
      field: 'score_max'
    },
    status : {
      type: DataTypes.ENUM,
      values: ['VALID', 'INVALID', 'LATE']
    },
    // determines if scorecard merits awarding place and cash prize
    pay: DataTypes.BOOLEAN,
    place: {
      type: DataTypes.INTEGER,
      validate: {
        min: 1,
        max: 6
      }
    },
    prize: DataTypes.FLOAT,
    createdBy: {
      type: DataTypes.STRING(128),
      field: 'created_by'
    },
    updatedBy: {
      type: DataTypes.STRING(128),
      field: 'updated_by'
    }
  }, {
    tableName : 'scorecards',
    underscored: true,
    associate : function(models) {
      Scorecard.hasMany(models.ScorecardItem);
      Scorecard.belongsTo(models.Challenge, {foreignKey: 'challenge_id'});
      Scorecard.belongsTo(models.Submission, {foreignKey: 'submission_id'});
      Scorecard.belongsTo(models.User, {foreignKey: 'reviewer_id'});
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

  return Scorecard;

};
