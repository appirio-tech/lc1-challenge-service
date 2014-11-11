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
    }
  }, {
    tableName : 'users',
    underscored: true,
    associate : function(models) {
      User.hasMany(models.Participant);
      User.hasMany(models.Scorecard);
      User.hasMany(models.Submission);
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

  return User;

};
