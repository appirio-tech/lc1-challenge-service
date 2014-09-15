'use strict';

var uploadDirectory,
  fs = require('fs'),
  multiparty = require('multiparty'),
  fileUploadStatus = {},
  stream = require('stream');

var checkOptions = function(options) {
  // check options for local storage configuration
  if(!options.uploads.uploadsDirectory) {
    return new Error('uploadsDirectory configuration is needed for local storage');
  }
};

module.exports = function(options) {
  var err = checkOptions(options);
  if(err) {
    throw err;
  }
  uploadDirectory = options.root + '/' + options.uploads.uploadsDirectory;
  var middleware = function(req, res, next) {
    var form;
    if(options.uploads.tempDir) {
      form = new multiparty.Form({uploadDir : options.root + '/' + options.uploads.tempDir});
    } else {
      form = new multiparty.Form();
    }
    form.on('file', function(name, file) {
      var tmpPath = file.path,
        fileName = file.originalFilename,
        targetPath = uploadDirectory + '/' + fileName;

        fileUploadStatus.filePath = targetPath;
        fileUploadStatus.fileName = fileName;
      fs.renameSync(tmpPath, targetPath, function(err) {
        console.log('Error moving file [ ' + targetPath + ' ] ' + JSON.stringify(err));
      });
    });

    form.on('error', function(err) {
      fileUploadStatus.err = err;
      req.fileUploadStatus = fileUploadStatus;
      next();
    });

    form.on('close', function() {
      req.fileUploadStatus = fileUploadStatus;
      next();
    });
    form.on('field', function(name, value) {
      if(name==='user_id') {
        req.body = {user_id : value};
      }
    });

    // ignoring parts. Implement any other logic here
    form.on('part', function(part) {
      var out = new stream.Writable();
      out._write = function (chunk, encoding, done) {
        done(); // Don't do anything with the data
      };
      part.pipe(out);
    });

    // parsing form
    form.parse(req);
  };
  return middleware;
};