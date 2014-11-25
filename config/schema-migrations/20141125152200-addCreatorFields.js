var dbm = require('db-migrate');
var async = require('async');
var type = dbm.dataType;

exports.up = function(db, callback) {
  async.series([
    db.runSql.bind(db, 'ALTER TABLE ONLY challenges ADD COLUMN creatorHandle character varying(128);'),
    db.runSql.bind(db, 'ALTER TABLE ONLY challenges ADD COLUMN creatorId bigint;')
  ], callback);
};

exports.down = function(db, callback) {
  async.series([
    db.runSql.bind(db, 'ALTER TABLE ONLY challenges DROP COLUMN IF EXISTS creatorHandle;'),
    db.runSql.bind(db, 'ALTER TABLE ONLY challenges DROP COLUMN IF EXISTS creatorId;')
  ], callback);
};
