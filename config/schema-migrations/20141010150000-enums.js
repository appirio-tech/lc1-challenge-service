var dbm = require('db-migrate');
var async = require('async');
var type = dbm.dataType;

exports.up = function (db, callback) {
  async.series([
    db.runSql.bind(db,
       "CREATE TYPE enum_challenges_status AS ENUM ( 'DRAFT', 'SUBMISSION', 'REVIEW', 'COMPLETE');"),
    db.runSql.bind(db,
        "CREATE TYPE \"enum_files_storage_location\" AS ENUM ('LOCAL', 'S3');"),
    db.runSql.bind(db,
        "CREATE TYPE enum_participants_role AS ENUM ('OWNER', 'SUBMITTER', 'WATCHER', 'REVIEWER');"),
    db.runSql.bind(db,
        "CREATE TYPE enum_scorecards_status AS ENUM ('VALID', 'INVALID', 'LATE');")
  ], callback);
};

exports.down = function (db, callback) {
  async.series([
    db.runSql.bind(db, "DROP TYPE enum_challenges_status;"),
    db.runSql.bind(db, "DROP TYPE \"enum_files_storage_location\";"),
    db.runSql.bind(db, "DROP TYPE enum_participants_role;"),
    db.runSql.bind(db, "DROP TYPE enum_scorecards_status;")
  ], callback);
};
