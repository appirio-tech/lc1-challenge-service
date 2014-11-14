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
      type: DataTypes.BIGINT, allowNull: false,
      get: function() {
        return parseInt(this.getDataValue('scorecardId'));
      }
    },
    requirementId: DataTypes.INTEGER,
    // score of submission
    score: DataTypes.FLOAT,
    // comment from reviewer
    comment : DataTypes.TEXT,
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
    tableName : 'scorecard_items',
    associate : function(models) {
      ScorecardItem.belongsTo(models.Scorecard, {foreignKey: 'scorecardId'});
      ScorecardItem.belongsTo(models.Requirement, {foreignKey: 'requirementId'});
    }
  });

  return ScorecardItem;

};
