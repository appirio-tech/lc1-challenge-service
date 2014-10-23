var dbm = require('db-migrate');
var async = require('async');
var type = dbm.dataType;

exports.up = function(db, callback) {
    async.series([
        // requirements table
        db.runSql.bind(db,
          'CREATE TABLE requirements ( ' +
            'id bigserial NOT NULL, ' +
            '"requirementText" text, ' +
            '"challengeId" bigint NOT NULL REFERENCES challenges("id") ON UPDATE CASCADE ON DELETE SET NULL ' +
          ');')
    ], callback);
};

exports.down = function(db, callback) {
    async.series([
        db.dropTable.bind(db, 'requirements')
    ], callback);
};
