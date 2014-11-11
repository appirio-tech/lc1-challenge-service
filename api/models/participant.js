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
      field: 'user_id',
      get: function() {
        return parseInt(this.getDataValue('userId'));
      }
    },
    challengeId: {
      type: DataTypes.BIGINT, allowNull: false,
      field: 'challenge_id',
      get: function() {
        return parseInt(this.getDataValue('challengeId'));
      }
    },
    // role of participant
    role : {
      type: DataTypes.ENUM,
      values: ['OWNER', 'SUBMITTER', 'WATCHER', 'REVIEWER'],
      allowNull: false
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
    tableName : 'participants',
    underscore: true,
    associate : function(models) {
      Participant.belongsTo(models.User, {foreignKey : 'user_id'});
      Participant.belongsTo(models.Challenge, {foreignKey : 'challenge_id'});
    }
  });

  return Participant;

};