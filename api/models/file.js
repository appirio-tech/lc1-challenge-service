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
      get: function() {
        return parseInt(this.getDataValue('challengeId'));
      }
    },
    submissionId: {
      type: DataTypes.BIGINT, allowNull: false,
      get: function() {
        return parseInt(this.getDataValue('submissionId'));
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
    fileUrl : {type: DataTypes.TEXT, allowNull: false},
    // file storage location
    storageLocation : {type: DataTypes.STRING(128), allowNull: false},
    createdBy: DataTypes.STRING(128),
    updatedBy: DataTypes.STRING(128)

  }, {
    tableName : 'files',
    associate : function(models) {
      File.belongsTo(models.Challenge, {foreignKey : 'challengeId'});
      File.belongsTo(models.Submission, {foreignKey : 'submissionId'});

    }
  });

  return File;

};
