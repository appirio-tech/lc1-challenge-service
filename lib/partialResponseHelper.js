/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
/**
 * Helper methods for controller logic.
 *
 * @version 1.0
 * @author lovefreya
 */
'use strict';

var _ = require('lodash');
var async = require('async');
var inflection = require('inflection');
var routeHelper = require('./routeHelper');
var dataSource = require('./../datasource');

/**
 * Judge whether the input character is accepted or not.
 * @param char
 * @returns {boolean}
 */
function allowedCharacter(char) {
  var allowedCharacterList = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  allowedCharacterList += 'abcdefghijklmnopqrstuvwxyz';
  allowedCharacterList += '_,()';
  for (var i = 0; i < allowedCharacterList.length; i += 1) {
    if (char === allowedCharacterList[i]) {
      return true;
    }
  }
  return false;
}

/**
 *  return offset
 * @param req
 * @param string
 * @returns {number}
 */
function findRightBracket(req, string) {
  var count = 0;
  for (var i = 0; i < string.length; i += 1) {
    if (string[i] === ')') {
      if (i === 0) {
        routeHelper.addValidationError(req, 'Fields parameter cannot take empty object ().');
        return i + 1;
      }
      if (count === 0) {
        return i + 1;
      } else {
        count -= 1;
      }
    }
    if (string[i] === '(') {
      count += 1;
    }
  }
  routeHelper.addValidationError(req, 'Fields parameter must take entire pair of \'()\' .');
}

/**
 *
 * @param req
 * @param param string waiting to parse
 * @param entity the parsed object will append to this entity's key
 * @param property the key in entity
 */
function iterationParse(req, param, entity, property) {
  var subObject = null;
  if (!property) {
    subObject = entity;
  } else {
    subObject = entity[property];
  }
  var cache = '';
  for (var i = 0; i < param.length; i += 1) {
    if (i === (param.length - 1)) {
      if (allowedCharacter(param[i]) && param[i]!=='(' && param[i]!==',') {
        cache += param[i];
        subObject[cache] = true;
        cache = '';
      } else {
        routeHelper.addValidationError(req, 'Fields parameter cannot end up with a \'' + param[i] + '\' .');
        return;
      }
      return;
    } else if (param[i] === ',') {
      if (i === 0) {
        routeHelper.addValidationError(req, 'Fields parameter cannot start with a \',\' .');
        return;
      }
      subObject[cache] = true;
      cache = '';
    } else if (param[i] === '(') {
      var rightPos = i + findRightBracket(req, param.substring(i + 1, param.length));
      //Now cache is a plural for the name of a known model.
      subObject[cache] = {};
      iterationParse(req, param.substring(i + 1, rightPos), subObject, cache);
      cache = '';
      i = rightPos + 1;
      if (param[i]) {
        if (param[i] === ')') {
          routeHelper.addValidationError(req, 'Fields parameter must take entire pair of \'()\' .');
          return;
        } else if (!allowedCharacter(param[i])) {
          routeHelper.addValidationError(req, 'Fields parameter cannot contain character \'' + param[i] + '\' .');
          return;
        } else if (param[i] !== ',') {
          routeHelper.addValidationError(req, 'Fields parameter format error.');
          return;
        }
      }
    } else {
      if (allowedCharacter(param[i])) {
        cache += param[i];
      } else {
        routeHelper.addValidationError(req, 'Fields parameter cannot contain character \'' + param[i] + '\' .');
        return;
      }
    }
  }
}

/**
 * If Model has this key, return true. Otherwise false.
 * @param Model
 * @param key
 */
function _hasKey(Model, key){
  var has = false;
  _.forEach(_.keys(Model.rawAttributes), function (column) {
    if (key === column) {
      has = true;
    }
  });
  return has;
}

/**
 * If Model has many models, return true. Otherwise false.
 * @param Model
 * @param models
 */
function _hasMany(Model, models){
  var has = false;
  _.forEach(_.keys(Model.associations), function (associatedModel) {
    //The associatedModel is like: challengesfiles which is challenges+files
    var Models = inflection.pluralize(Model.name.toLowerCase());
    if ( (Models+models === associatedModel || models+Models === associatedModel ) &&
      Model.associations[associatedModel].associationType === 'HasMany') {
        has = true;
    }
  });
  return has;
}

/**
 *
 * @param req request object
 * @param Model Model need to be reduced
 * @param Entity the response entity wrapper
 * @param Property the key
 * @param Fields fields won't be reduced
 * @param callback
 */
function recursionReduce(req, Model, Entity, Property, Fields, callback){
  var subObject = Entity[Property];
  if(_.isArray(subObject)){

    var tasks = [];
    var index=-1;
    _.forEach(subObject, function(entity){

      tasks.push(function(callback){

        var reducedObject = {};
        var tasksB = [];
        if(!_.isObject(Fields)){
          reducedObject = entity.values;
        }else{
          _.forEach(_.keys(Fields), function(key){
            tasksB.push(function(callback){
              if(_hasKey(Model, key)){
                reducedObject[key] = entity.values[key];
                callback(null);
              }else if(_hasMany(Model, key)){
                var modelName = inflection.capitalize(inflection.singularize(key));
                var foreignKey = Model.name.toLowerCase() + 'Id';
                var filter = {};
                filter[foreignKey] = entity.id;
                dataSource.getDataSource()[modelName].findAll({where: filter}).success(function(entities){
                  reducedObject[key] = entities;
                  recursionReduce(req, dataSource.getDataSource()[modelName], reducedObject, key, Fields[key], callback);
                }).error(function(err){
                  routeHelper.addError(req, err, 500);
                  reducedObject[key] = [];
                  callback();
                });
              }else{
                routeHelper.addValidationError(req, Model.name+' doesn\'t has ' + key);
                callback(null);
              }
            });
          });
        }

        index += 1;
        subObject[index] = reducedObject;
        async.series(tasksB, function(){
          callback(null);
        });
      });

    });

    async.series(tasks, function(){
      callback();
    });
  }else{

    var reducedObject = {};
    var tasksC = [];

    if(!_.isObject(Fields)){
      reducedObject = subObject.values;
    }else{
      _.forEach(_.keys(Fields), function(key){
        tasksC.push(function(callback){
          if(_hasKey(Model, key)){
            reducedObject[key] = subObject.values[key];
            callback(null);
          }else if(_hasMany(Model, key)){
            var modelName = inflection.capitalize(inflection.singularize(key));
            var foreignKey = Model.name.toLowerCase() + 'Id';
            var filter = {};
            filter[foreignKey] = subObject.id;
            dataSource.getDataSource()[modelName].findAll({where: filter}).success(function(entities){
              reducedObject[key] = entities;
              recursionReduce(req, dataSource.getDataSource()[modelName], reducedObject, key, Fields[key], callback);
            }).error(function(err){
              routeHelper.addError(req, err, 500);
              reducedObject[key] = [];
              callback();
            });
          }else{
            routeHelper.addValidationError(req, Model.name+' doesn\'t has ' + key);
            callback(null);
          }
        });
      });
    }
    Entity[Property] = reducedObject;
    async.series(tasksC, function(){
      callback();
    });
  }
}

/**
 * Parse fields parameter if exist in all get call.
 * @param req
 * @param res
 * @param next
 */
exports.parseFields = function (req, res, next) {
  var param = req.query.fields;
  delete req.query.fields;
  if (param && typeof param === 'string') {
    param = param.trim();
    var fields = {};
    if (req.method !== 'GET') {
      routeHelper.addValidationError(req, 'Fields parameter is not allowed for ' + req.method + ' call.');
    } else {
      iterationParse(req, param, fields);
    }
    //append to req object
    req.partialResponse = fields;
  }
  //console.log(req.partialResponse);

  next();
};

exports.reduceFieldsAndExpandObject = function(Model, req, next){
  if (!req.data || !req.data.content || !req.partialResponse || req.error) {
    next();
  } else {
    recursionReduce(req, Model, req.data, 'content', req.partialResponse, next);
  }
};
