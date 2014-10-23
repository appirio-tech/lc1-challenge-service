/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
/**
 * This controller provides methods to access Requirements.
 *
 * @version 1.0
 * @author spanhawk
 */
'use strict';


var datasource = require('./../../datasource').getDataSource();
var Challenge = datasource.Challenge;
var Requirement = datasource.Requirement;
var controllerHelper = require('./../../lib/controllerHelper');


// build controller for the nested files resource
var requirementController = controllerHelper.buildController(Requirement, [Challenge], {filtering: false});


module.exports = {
    createRequirement: requirementController.create,
    getAllRequirementsByChallengeId: requirementController.all,
    getRequirements: requirementController.get,
    updateRequirement: requirementController.update,
    deleteRequirements: requirementController.delete
};
