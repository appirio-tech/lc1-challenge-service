/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
/**
 * Represent Participant in the system.
 *
 * @version 1.0
 * @author peakpado
 */
'use strict';

/**
* Defining Participant model
*/
module.exports = function(sequelize, DataTypes) {
  var Participant = sequelize.define('Participant', {
    // primary key
    id: {
      type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true,
      get: function() {
        return parseInt(this.getDataValue('id'));
      }
    },
    // user id of a participant
    userId : {
      type: DataTypes.BIGINT, allowNull: false,
      get: function() {
        return parseInt(this.getDataValue('userId'));
      }
    },
    challengeId: {
      type: DataTypes.BIGINT, allowNull: false,
      get: function() {
        return parseInt(this.getDataValue('challengeId'));
      }
    },
    // role of participant
    role : {
      type: DataTypes.ENUM,
      values: ['owner', 'submitter', 'watcher', 'reviewer'],
      allowNull: false
    },
    createdBy: DataTypes.STRING(128),
    updatedBy: DataTypes.STRING(128)

  }, {
    tableName : 'participants',
    associate : function(models) {
      Participant.belongsTo(models.User, {foreignKey : 'userId'});
      Participant.belongsTo(models.Challenge, {foreignKey : 'challengeId'});
    }
  });

  return Participant;

};