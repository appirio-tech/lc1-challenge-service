/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
/**
 * This controller provides methods to access ScorecardItems.
 *
 * @version 1.0
 * @author peakpado
 */
'use strict';


var datasource = require('./../../datasource').getDataSource();
var Challenge = datasource.Challenge;
var Scorecard = datasource.Scorecard;
var ScorecardItem = datasource.ScorecardItem;
var serenityControllerHelper = require('serenity-controller-helper');
var config = require('config');
var controllerHelper = new serenityControllerHelper(config);


var options = {
  filtering: false,
  entityFilterIDs: ['scorecardId']
};


// build controller for the nested scorecardItems resource
var scorecardItemController = controllerHelper.buildController(ScorecardItem, [Challenge, Scorecard], options);


module.exports = {
  getScoreCardItemsByScorecard: scorecardItemController.all,
  createScorecardItem: scorecardItemController.create,
  getScorecardItem: scorecardItemController.get,
  updateScorecardItem: scorecardItemController.update,
  deleteScorecardItem: scorecardItemController.delete

};