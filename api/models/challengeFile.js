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
  var ChallengeFile = sequelize.define('ChallengeFile', {
    challengeId: {
      type: DataTypes.BIGINT, primaryKey: true,
      get: function() {
        return parseInt(this.getDataValue('challengeId'));
      }
    },
    fileId: {
      type: DataTypes.BIGINT, primaryKey: true,
      get: function() {
        return parseInt(this.getDataValue('fileId'));
      }
    },

  }, {
    tableName : 'challenge_files',
    associate : function(models) {
      ChallengeFile.belongsTo(models.Challenge, {foreignKey : 'challengeId'});
      ChallengeFile.belongsTo(models.File, {foreignKey : 'fileId'});
    }
  });

  return ChallengeFile;

};
