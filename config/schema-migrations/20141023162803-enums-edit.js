var dbm = require('db-migrate');
var async = require('async');
var type = dbm.dataType;

exports.up = function (db, callback) {
    async.series([
        db.runSql.bind(db,
            "UPDATE pg_enum SET enumlabel = 'SUBMISSION' WHERE enumlabel = 'ACTIVE' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'enum_challenges_status');"),
    ], callback);
};

exports.down = function (db, callback) {
    async.series([
        db.runSql.bind(db, "DROP TYPE enum_challenges_status CASCADE;")
    ], callback);
};