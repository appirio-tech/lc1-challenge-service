
var aws = require('aws-sdk');
var config = require('config');

function getAWSUrl(operation, fileUrl, cb) {
  aws.config.update({
    accessKeyId: config.get('aws.key'),
    secretAccessKey: config.get('aws.secret')
  });

  var s3 = new aws.S3();

  var s3_params = {
    Bucket: config.get('aws.bucket'),
    Key: fileUrl,
    Expires: 60
  };

  s3.getSignedUrl(operation, s3_params, cb);
}

module.exports = {
  getDownloadURL: function(fileUrl, cb) {
    getAWSUrl('getObject', fileUrl, cb);
  },

  getUploadURL: function(fileUrl, cb) {
    getAWSUrl('putObject', fileUrl, cb);
  }
};
