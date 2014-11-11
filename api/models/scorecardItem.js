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
      field: 'scorecard_id',
      get: function() {
        return parseInt(this.getDataValue('scorecardId'));
      }
    },
    requirementId: {
      type: DataTypes.INTEGER,
      field: 'requirement_id'
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
    }
  }, {
    tableName : 'scorecard_items',
    underscored: true,
    associate : function(models) {
      ScorecardItem.belongsTo(models.Scorecard, {foreignKey: 'scorecard_id'});
      ScorecardItem.belongsTo(models.Requirement, {foreignKey: 'requirement_id'});
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

  return ScorecardItem;

};
