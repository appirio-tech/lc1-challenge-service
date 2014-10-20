/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
/**
 * This controller provides methods to access Scorecards.
 *
 * @version 1.0
 * @author peakpado
 */
'use strict';


var datasource = require('./../../datasource').getDataSource();
var Challenge = datasource.Challenge;
var Scorecard = datasource.Scorecard;
var controllerHelper = require('./../../lib/controllerHelper');


// build controller for the nested scorecards resource
var scorecardController = controllerHelper.buildController(Scorecard, [Challenge], {filtering: false});


module.exports = {
  createScorecard: scorecardController.create,
  getAllScorecardsByChallengeId: scorecardController.all,
  getScorecardbyId: scorecardController.get,
  updateScorecard: scorecardController.update,
  deleteScorecard: scorecardController.delete

};