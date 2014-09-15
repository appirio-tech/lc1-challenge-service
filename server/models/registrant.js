'use strict';

/**
 * Defining Registrant model
 */

module.exports = function(sequelize, DataTypes) {
  var Registrant = sequelize.define('Registrant', {
        id : {type : DataTypes.INTEGER, autoIncrement : true, primaryKey: true},
        userId : {type : DataTypes.INTEGER}
      }, {
        associate: function(models) {
          Registrant.belongsTo(models.Challenge);
        }
      });
  return Registrant;
};