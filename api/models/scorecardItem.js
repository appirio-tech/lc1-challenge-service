/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
/**
 * Represent ScorecardItem in the system.
 *
 * @version 1.0
 * @author peakpado
 */
'use strict';

/**
* Defining ScorecardItem model
*/
module.exports = function(sequelize, DataTypes) {

  var ScorecardItem = sequelize.define('ScorecardItem', {
    // primary key
    id: {
      type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true,
      get: function() {
        return parseInt(this.getDataValue('id'));
      }
    },
    // scorecard id of this item
    scorecardId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'scorecard_id',
      get: function() {
        return parseInt(this.getDataValue('scorecardId'));
      }
    },
    requirementId: {
      type: DataTypes.INTEGER,
      field: 'requirement_id',
      get: function() {
        return parseInt(this.getDataValue('requirementId'));
      }
    },
    // score of submission
    score: DataTypes.FLOAT,
    // comment from reviewer
    comment : DataTypes.TEXT,
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
    tableName : 'scorecard_items',
    underscore: true,
    associate : function(models) {
      ScorecardItem.belongsTo(models.Scorecard, {foreignKey: 'scorecard_id'});
      ScorecardItem.belongsTo(models.Requirement, {foreignKey: 'requirement_id'});
    }
  });

  return ScorecardItem;

};
