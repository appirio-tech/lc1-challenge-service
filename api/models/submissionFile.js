/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
/**
 * Represent File in the system.
 *
 * @author gfzabarino
 */
'use strict';

/**
 * Defining ChallengeFile model
 */
module.exports = function(sequelize, DataTypes) {
  var SubmissionFile = sequelize.define('SubmissionFile', {
    submissionId: {
      type: DataTypes.BIGINT, primaryKey: true,
      get: function() {
        return parseInt(this.getDataValue('submissionId'));
      }
    },
    fileId: {
      type: DataTypes.BIGINT, primaryKey: true,
      get: function() {
        return parseInt(this.getDataValue('fileId'));
      }
    }
  }, {
    tableName : 'submission_files',
    associate : function(models) {
      SubmissionFile.belongsTo(models.Submission, {foreignKey : 'submissionId'});
      SubmissionFile.belongsTo(models.File, {foreignKey : 'fileId'});
    }
  });

  return SubmissionFile;

};
