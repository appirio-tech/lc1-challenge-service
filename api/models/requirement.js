/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */

/**
 * Represent Requirement in the system.
 *
 * @version 1.0
 * @author spanhawk
 */
'use strict';

/**
* Defining Requirement model
*/
module.exports = function(sequelize, DataTypes) {

  var Requirement = sequelize.define('Requirement', {
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
    requirementText : DataTypes.TEXT,
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
  }, {
    tableName : 'requirements',
    associate : function(models) {
      Requirement.belongsTo(models.Challenge, {foreignKey : 'challengeId'});
      Requirement.hasMany(models.ScorecardItem);
    }
  });

  return Requirement;

};
