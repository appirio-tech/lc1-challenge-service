'use strict';

var _options,
  _config,
  _challengeService = require('../services/ChallengeService'),
  controllerHelper = require('./ControllerHelper'),
  InvalidRequestError = require('../errors/InvalidRequestError');

/**
 * <p>
 * The async module.
 * </p>
 *
 * @type Object.
 */
var async = require('async');

/**
 * Initializes controller.
 * @param {Object}       options        Controller specific object
 * @param {config}       config         Global configuration
 */
exports.init = function init(options, config) {
  _options = options;
  _config = config;
};

/**
 * Process query parameters
 * @param  {Object}       query       Query object
 * @return {Object}       searchCriteria object after processing the query parameter
 */
var processQueryParameters = function(query) {
  var searchCriteria = {};
  for(var key in query) {
    if(query.hasOwnProperty(key)) {
      var value = query[key];
      if(key==='regStartDate') {
        searchCriteria.regStartDate = value;
      } else if(key==='subEndDate') {
        searchCriteria.subEndDate = value;
      } else if(key==='title') {
        // can be comma seperated values
        if(value.indexOf(',')!==-1) {
          value = value.split(',');
        }
        searchCriteria.title = value;
      } else if(key==='status') {
        // can be comma seperated values
        if(value.indexOf(',')!==-1) {
          value = value.split(',');
        }
        searchCriteria.status = value;
      } else if(key==='type') {
        // can be comma seperated values
        if(value.indexOf(',')!==-1) {
          value = value.split(',');
        }
        searchCriteria.type = value;
      } else if(key==='tags') {
        // can be comma seperated values
        if(value.indexOf(',')!==-1) {
          value = value.split(',');
        }
        searchCriteria.type = value;
      }
    }
  }
  return searchCriteria;
};

/**
 * Persist the challenge entity into DB
 * @param {[type]}      challenge     challenge entity
 * @param {Function}    callback      callback function
 */
var addChallenge = function(challenge, callback) {
  _challengeService.createChallenge(challenge, callback);
};

/**
 * This will return a function that will validate the challenge object before save into DB
 */
var validateChallenge = function() {
  return function(challenge, callback) {
    var err;
    // value should be present for every key
    for(var key in challenge) {
      if(challenge.hasOwnProperty(key)) {
        var value = challenge[key];
        if(!value) {
          err = new InvalidRequestError('invalid_request', {message : 'Value should be present for every key in challenge entity'});
        }
      }
    }

    /**
     * check challenge date field.
     * For the sake of convinience The client has to pass the date in the standard format
     * Number of milliseconds since epoch i.e, 1970/01/01
     */
    if(challenge.regStartDate) {
      if(controllerHelper.isValidDateValue(challenge.regStartDate)) {
        /**
         * converting date into date object
         */
        challenge.regStartDate = controllerHelper.getDate(challenge.regStartDate);
      } else {
        err = new InvalidRequestError('invalid_request', {message : 'Invalid date value ' + challenge.regStartDate});
      }
    }
    if(challenge.subEndDate) {
      if(controllerHelper.isValidDateValue(challenge.subEndDate)) {
        /**
         * converting date into date object
         */
        challenge.subEndDate = controllerHelper.getDate(challenge.subEndDate);
      } else {
        err = new InvalidRequestError('invalid_request', {message : 'Invalid date value ' + challenge.subEndDate});
      }
    }
    // Tags should be an array
    if(challenge.tags) {
      if(!controllerHelper.isArray(challenge.tags)) {
        err = new InvalidRequestError('invalid_request', {message : 'Tags should be an array of text'});
      }
    }
    // All validation complete
    if(err) {
      callback(err, null);
    } else {
      callback(null, challenge);
    }
  };
};

/**
 * Search function. Will process the query parameters and return searchcriteria
 * @param  {Object}     req     Request object
 * @param  {Object}     res     Response Object
 * @return {Object}             searchCriteria Object
 */
var searchChallenges = function(req, res) {
  var query = req.query;
  return processQueryParameters(query);
};

/**
 * Returns all challenges. This will not load Challenge model associations by default
 * @param  {Object}   req           Request object
 * @param  {Object}   res           Response object
 * @param  {Function} next          Next function
 */
exports.getAll = function(req, res, next) {
  var searchCriteria;
  var err = controllerHelper.checkObject(req.query, 'body');  
  if(!err) {
    // query fileds are present search the challenges based on given criteria
    searchCriteria = searchChallenges(req, res);
  }
  _challengeService.getAll(searchCriteria, function(err, challenges) {
    controllerHelper.sendResponse(err, challenges, req, res);
  });
};

/**
 * Returns a single challenge. This will eagerly load Challenge model associations by default
 * @param  {Object}     req           Request object
 * @param  {Object}     res           Response object
 * @param  {Function}   next          Next function
 */
exports.getSingle = function(req, res, next) {
  var id = req.params.id;
  var err = controllerHelper.checkNumber(id, 'id');
  if(err) {
    // Invalid request wrapper for error. So that every error format will be unique
    controllerHelper.checkRequest(res, new InvalidRequestError('invalid_request', err));
  } else {
    var param = controllerHelper.getNumber(id);
    _challengeService.getSingle(param, function(err, challenge) {
      controllerHelper.sendResponse(err, challenge, req, res);
    });
  }
};

/**
 * Create the challenge. req.body can be a single challenge object or a array of challenge object
 * @param  {Object}     req           Request object
 * @param  {Object}     res           Response object
 * @param  {Function}   next          Next function
 */
exports.createChallenge = function(req, res, next) {
  var err = controllerHelper.checkDefined(req.body, 'Request body');
  if(err) {
    controllerHelper.checkRequest(res, new InvalidRequestError('invalid_request', err));
    return;
  }

  // req.body can be a single object or array of objects
  var challenges = [];
  if(controllerHelper.isArray(req.body)) {
    challenges = req.body;
  } else {
    challenges.push(req.body);
  }

  async.waterfall([
    // validate challenges
    function (cb) {
      async.mapSeries(challenges, validateChallenge(), cb);
    },
    // create challenges
    function(challenges, callback) {
      async.mapSeries(challenges, addChallenge, callback);
    }
  ], function(err, results) {
      controllerHelper.sendResponse(err, results, req, res);
    }
  );
};

/**
 * Register a user for a challenge
 * @param  {Object}     req           Request object
 * @param  {Object}     res           Response object
 * @param  {Function}   next          Next function
 */
exports.registerForChallenge = function(req, res, next) {
  var id = req.params.id,
    body = req.body;
  var err = controllerHelper.checkNumber(id, 'id') || controllerHelper.checkDefined(body) || controllerHelper.checkNumber(body.user_id);
  if(err) {
    controllerHelper.checkRequest(res, new InvalidRequestError('invalid_request', err));
    return;
  }
  var userId = req.body.user_id;
  _challengeService.register(id, userId, function(err, result) {
    controllerHelper.sendResponse(err, result, req, res);
  });
};

/**
 * Challenge submisson END POINT.
 * NOTE: This will only be called if the file is uploaded successfully
 * req.fileUploadStatus is set by the uploadMiddleware
 * File will upload either to amazon  s3 or local storage
 * @param  {Object}     req                     Request object
 * @param  {Object}     res                     Response object
 * @param  {Function}   next                    next function
 */
exports.submission = function(req, res, next) {
  var fileUploadStatus = req.fileUploadStatus || {};
  var body = req.body,
    userId = body.user_id,
    id = req.params.id;
  var err = fileUploadStatus.err || controllerHelper.checkNumber(userId, 'user id') || controllerHelper.checkNumber(id, 'id');
  if(err) {
    controllerHelper.checkRequest(res, new InvalidRequestError('invalid_request', err));
    return;
  }
  var filePath = fileUploadStatus.filePath;
  _challengeService.submit(id, userId, filePath, function(err, result) {
    controllerHelper.sendResponse(err, result, req, res);
  });
};