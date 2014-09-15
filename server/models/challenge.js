'use strict';

/**
 * Defining Challenge model
 */

module.exports = function(sequelize, DataTypes) {
  var Challenge = sequelize.define('Challenge', {
        id: {type : DataTypes.INTEGER, autoIncrement : true, primaryKey: true},
        regStartDate: DataTypes.DATE,
        subEndDate: DataTypes.DATE,
        title: {
          type: DataTypes.STRING(128),
          validate: {
            notNull: true,
            notEmpty: true
          }
        },
        status : DataTypes.STRING(32),
        type: DataTypes.STRING(32),
        overview: DataTypes.STRING(140),
        description: DataTypes.TEXT,
        registeredDescription: DataTypes.TEXT,
        tags: DataTypes.ARRAY(DataTypes.TEXT)
      }, {
        associate : function(models) {
          Challenge.hasMany(models.Submission);
          Challenge.hasMany(models.Registrant);
        }
      });
  return Challenge;
};