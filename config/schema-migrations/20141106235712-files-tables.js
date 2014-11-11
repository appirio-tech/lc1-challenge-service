var dbm = require('db-migrate');
var type = dbm.dataType;
var async = require('async');

exports.up = function(db, callback) {

  async.series([
    function (callback) {
      // challenge files table
      db.createTable('challenge_files', {
        columns: {
          '"fileId"': {type: 'int', primaryKey: true},
          '"challengeId"': {type: 'int', primaryKey: true}
        },
        ifNotExists: true
      }, callback);
    }, function (callback) {
      // submission files table
      db.createTable('submission_files', {
        columns: {
          '"fileId"': {type: 'int', primaryKey: true},
          '"submissionId"': {type: 'int', primaryKey: true}
        },
        ifNotExists: true
      }, callback);
    }, function (callback) {
      db.runSql('ALTER TABLE challenge_files ADD CONSTRAINT challenge_fk FOREIGN KEY ("challengeId") REFERENCES challenges (id) ON UPDATE CASCADE ON DELETE CASCADE;', callback);
    }, function (callback) {
      db.runSql('ALTER TABLE submission_files ADD CONSTRAINT submission_fk FOREIGN KEY ("submissionId") REFERENCES submissions (id) ON UPDATE CASCADE ON DELETE CASCADE;', callback);
    }, function (callback) {
      db.runSql('ALTER TABLE challenge_files ADD CONSTRAINT file_fk FOREIGN KEY ("fileId") REFERENCES files (id) ON UPDATE CASCADE ON DELETE CASCADE;', callback);
    }, function (callback) {
      db.runSql('ALTER TABLE submission_files ADD CONSTRAINT file_fk FOREIGN KEY ("fileId") REFERENCES files (id) ON UPDATE CASCADE ON DELETE CASCADE;', callback);
    }, function (callback) {
      db.runSql('ALTER TABLE challenge_files ADD COLUMN "createdAt" timestamp with time zone NOT NULL;', callback);
    }, function (callback) {
      db.runSql('ALTER TABLE challenge_files ADD COLUMN "updatedAt" timestamp with time zone NOT NULL;', callback);
    }, function (callback) {
      db.runSql('ALTER TABLE submission_files ADD COLUMN "createdAt" timestamp with time zone NOT NULL;', callback);
    }, function (callback) {
      db.runSql('ALTER TABLE submission_files ADD COLUMN "updatedAt" timestamp with time zone NOT NULL;', callback);
    }
  ], callback);
};

exports.down = function(db, callback) {
  async.series([
    function (callback) {
      db.dropTable('challenge_files', callback);
    }, function (callback) {
      db.dropTable('submission_files', callback);
    }
  ], callback);
};
