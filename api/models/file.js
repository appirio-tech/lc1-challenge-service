/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
/**
 * Represent File in the system.
 *
 * @version 1.0
 * @author peakpado
 */
'use strict';

/**
* Defining File model
*/
module.exports = function(sequelize, DataTypes) {
  var File = sequelize.define('File', {
    // primary key
    id: {
      type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true,
      get: function() {
        return parseInt(this.getDataValue('id'));
      }
    },
    title : {type: DataTypes.TEXT},
    filePath : {type: DataTypes.TEXT, allowNull: false},
    size : {
      type: DataTypes.BIGINT, allowNull: false,
      get: function() {
        return parseInt(this.getDataValue('size'));
      }
    },
    fileName : {type: DataTypes.TEXT, allowNull: false},
    // file storage location
    storageLocation : {
      type: DataTypes.ENUM,
      values: ['local', 's3'],
      allowNull: false
    },
    createdBy: DataTypes.STRING(128),
    updatedBy: DataTypes.STRING(128)

  }, {
    tableName : 'files',
    associate : function(models) {
      File.hasMany(models.ChallengeFile);
      File.hasMany(models.SubmissionFile);
    }
  });

  return File;

};
