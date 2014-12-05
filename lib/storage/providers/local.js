


module.exports = {
  getDownloadURL: function(fileUrl, cb) {
    cb(null, fileUrl);
  },
  getUploadURL: function(fileUrl, cb) {
    cb(null, null);
  }
};