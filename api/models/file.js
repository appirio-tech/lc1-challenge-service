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
      type: DataTypes.BIGINT, allowNull: false,
      field: 'challenge_id',
      get: function() {
        return parseInt(this.getDataValue('challengeId'));
      }
    },
    submissionId: {
      type: DataTypes.BIGINT, allowNull: false,
      field: 'submission_id',
      get: function() {
        return parseInt(this.getDataValue('submissionId'));
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
    }
  }, {
    tableName : 'files',
    underscored: true,
    associate : function(models) {
      File.belongsTo(models.Challenge, {foreignKey : 'challenge_id'});
      File.belongsTo(models.Submission, {foreignKey : 'submission_id'});

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

  return File;

};
