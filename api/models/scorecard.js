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
      get: function() {
        return parseInt(this.getDataValue('challengeId'));
      }
    },
    // user id of reviewer
    reviewerId: {
      type: DataTypes.BIGINT,
      get: function() {
        return parseInt(this.getDataValue('reviewerId'));
      }
    },
    submissionId: {
      type: DataTypes.BIGINT,
      get: function() {
        return parseInt(this.getDataValue('submissionId'));
      }
    },
    // sum of all the scorecard items scorecard
    scoreSum: DataTypes.INTEGER,
    // scoreSum / scoreMax from scorecard items
    scorePercent: DataTypes.FLOAT,
    // sum of highest possible score from scorecard items
    scoreMax: DataTypes.FLOAT,
    status : {
      type: DataTypes.ENUM,
      values: ['NEW', 'SAVED', 'SUBMITTED']
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
    createdBy: DataTypes.STRING(128),
    updatedBy: DataTypes.STRING(128)
  }, {
    tableName : 'scorecards',
    associate : function(models) {
      Scorecard.hasMany(models.ScorecardItem);
      Scorecard.belongsTo(models.Challenge, {foreignKey: 'challengeId'});
      Scorecard.belongsTo(models.Submission, {foreignKey: 'submissionId'});
      Scorecard.belongsTo(models.User, {foreignKey: 'reviewerId'});
    }
  });

  return Scorecard;

};
