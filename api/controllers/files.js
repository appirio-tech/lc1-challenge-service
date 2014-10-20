/**
 * Copyright (c) 2014 TopCoder, Inc. All rights reserved.
 */
/**
 * This controller provides methods to access File.
 *
 * @version 1.0
 * @author peakpado
 */
'use strict';


var datasource = require('./../../datasource').getDataSource();
var Challenge = datasource.Challenge;
var Submission = datasource.Submission;
var File = datasource.File;
var controllerHelper = require('./../../lib/controllerHelper');


// build controller for the nested files resource
var fileController = controllerHelper.buildController(File, [Challenge, Submission], {filtering: false});


module.exports = {
  getFiles: fileController.all,
  addFile: fileController.create,
  getFile: fileController.get,
  updateFile: fileController.update,
  deleteFile: fileController.delete
};
