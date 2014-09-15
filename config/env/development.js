'use strict';

module.exports = {
  /**
   * Uploads configuration
   * If local storage will be false then application by defaults initialize S3 upload service
   * For local storage uploadsDirectory is mandatory.
   * If temp directory is not given it will default to os.tempdir()
   *
   * For s3 upload configuration
   * key, secret bucket and region properties are mandatory
   * @type {Object}
   */
  uploads : {
    isLocalStorage : false,
    uploadsDirectory : './uploads',
    tempDir : './temp'
  },
  /**
   * AWS configuration for s3 upload service
   * @type {Object}
   */
  aws : {
    secure: false,
    key: '',
    secret: '',
    bucket: 'challenge-api',
    region : ''
  },
  /**
   * Database configuration
   * @type {String}
   */
  dburl : '',
  pg : {
    dialect: 'postgres', 
    port : 5432, 
    omitNull: true
  },
  /**
   * Global route configuration
   * @type {Object}
   */
  routes: {
    'GET /challenges' : 'Challenges#getAll',
    'GET /challenges/:id' : 'Challenges#getSingle',
    'POST /challenges': 'Challenges#createChallenge',
    'POST /challenges/:id/register' : 'Challenges#registerForChallenge',
    'POST /challenges/:id/submit' : 'Challenges#submission'
  },
  /**
   * Global controllers configuration
   * @type {Object}
   */
  controllers : {
    Challenges : {
      options : {
      }
    }
  }
};