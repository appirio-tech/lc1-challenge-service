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
      field: 'challenge_id',
      get: function() {
        return parseInt(this.getDataValue('challengeId'));
      }
    },
    requirementText: {
      type: DataTypes.TEXT,
      field: 'requirement_text'
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
    tableName : 'requirements',
    underscore: true,
    associate : function(models) {
      Requirement.belongsTo(models.Challenge, {foreignKey : 'challenge_id'});
      Requirement.hasMany(models.ScorecardItem);
    }
  });

  return Requirement;

};
