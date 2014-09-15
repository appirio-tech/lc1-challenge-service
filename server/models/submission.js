'use strict';
/**
 * Defining Submission model
 */

module.exports = function(sequelize, DataTypes) {
  var Submission = sequelize.define('Submission', {
        id : {type : DataTypes.INTEGER, autoIncrement : true, primaryKey: true},
        userId : {type : DataTypes.INTEGER},
        filePath: {type: DataTypes.TEXT,
                validate : {
                  notNull: true,
                  notEmpty: true
                }
              }
      }, {
          associate: function(models) {
            Submission.belongsTo(models.Challenge);
          }
      });

  return Submission;
};