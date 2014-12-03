/**
 * handle file upload and downloading
 */

var config = require('config');

function loadProvider() {
  var providerName = 'local';

  if (config.has('app.storageProvider')) {
    providerName = config.get('app.storageProvider');
  }

  return require('./providers/' + providerName);
}

module.exports = {
  /**
   * Create a download URL based upon the provider
   *
   * @param file
   *  The File model
   *  @param cb
   *    Callback (err, url)
   */
  getDownloadUrl: function(file, cb) {
    // Get storage provider

    var provider = loadProvider();
    provider.getDownloadURL(file.fileUrl, cb);
  },

  getUploadUrl: function(file, cb) {
    var provider = loadProvider();
    provider.getUploadURL(file.fileUrl, cb);
  }
};