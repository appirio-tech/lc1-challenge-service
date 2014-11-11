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
    tableName : 'users',
    underscore: true,
    associate : function(models) {
      User.hasMany(models.Participant);
      User.hasMany(models.Scorecard);
      User.hasMany(models.Submission);
    }
  });

  return User;

};
