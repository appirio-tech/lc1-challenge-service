var dbm = require('db-migrate');
var async = require('async');
var type = dbm.dataType;

exports.up = function(db, callback) {
  console.info('migrate!!!');
  db.all('SELECT "column_name" ' +
  'FROM "information_schema"."columns" ' +
  'WHERE "table_name"=\'files\' and "column_name"=\'challengeId\';', function (err, results) {
    if (err) {
      return callback(err);
    }
    if (results && results.length) {
      async.series([
        function (callback) {
          db.runSql('INSERT INTO challenge_files ("fileId", "challengeId", "createdAt", "updatedAt") ' +
          'SELECT id, "challengeId", "createdAt", "updatedAt" ' +
          'FROM files WHERE "challengeId" IS NOT NULL', callback);
        }, function (callback) {
          db.runSql('INSERT INTO submission_files ("fileId", "submissionId", "createdAt", "updatedAt") ' +
          'SELECT id, "submissionId", "createdAt", "updatedAt" ' +
          'FROM files WHERE "submissionId" IS NOT NULL', callback);
        }, function (callback) {
          db.runSql('ALTER TABLE files DROP COLUMN "submissionId"', callback);
        }, function (callback) {
          db.runSql('ALTER TABLE files DROP COLUMN "challengeId"', callback);
        }
      ], callback);
    } else {
      callback();
    }
  });
};

exports.down = function(db, callback) {
  callback();
};
