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
    challengeId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      field: 'challenge_id',
      get: function() {
        return parseInt(this.getDataValue('challenge_id'));
      }
    },
    submissionId: {
      type: DataTypes.BIGINT,
      field: 'submission_id',
      get: function() {
        return parseInt(this.getDataValue('submission_id'));
      }
    },
    title : {type: DataTypes.TEXT},
    filePath : {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'file_path'
    },
    size : {
      type: DataTypes.BIGINT, allowNull: false,
      get: function() {
        return parseInt(this.getDataValue('size'));
      }
    },
    fileName : {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'file_name'
    },
    // file storage location
    storageLocation : {
      type: DataTypes.ENUM,
      values: ['LOCAL', 'S3'],
      allowNull: false,
      field: 'storage_location'
    },
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
    tableName : 'files',
    underscore: true,
    associate : function(models) {
      File.belongsTo(models.Challenge, {foreignKey : 'challenge_id'});
      File.belongsTo(models.Submission, {foreignKey : 'submission_id'});

    }
  });

  return File;

};
