/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
/**
 * Represent User in the system.
 *
 * @version 1.0
 * @author peakpado
 */
'use strict';

/**
* Defining User model
*/
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    name: DataTypes.TEXT,
    email: DataTypes.TEXT,
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
    tableName : 'users',
    associate : function(models) {
      User.hasMany(models.Participant);
      User.hasMany(models.Scorecard);
      User.hasMany(models.Submission);
    }
  });

  return User;

};
