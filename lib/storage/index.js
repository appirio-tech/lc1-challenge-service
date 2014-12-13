/**
 * handle file upload and downloading
 */

var config = require('config');

function loadProvider(providerName) {
  providerName = providerName.toLowerCase();

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

    var provider = loadProvider(file.storageLocation);
    provider.getDownloadURL(file.fileUrl, cb);
  },

  getUploadUrl: function(file, cb) {
    var provider = loadProvider(file.storageLocation);
    provider.getUploadURL(file.fileUrl, cb);
  }
};