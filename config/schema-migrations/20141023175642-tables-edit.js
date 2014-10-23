var dbm = require('db-migrate');
var async = require('async');
var type = dbm.dataType;

exports.up = function(db, callback) {
    async.series([
        // challenges table edit
        db.runSql.bind(db, 'ALTER TABLE ONLY challenges ADD COLUMN prizes NUMERIC(11,2)[];'),
        db.runSql.bind(db, 'ALTER TABLE ONLY challenges ADD COLUMN account character varying(255)'),
        db.runSql.bind(db, 'ALTER TABLE ONLY challenges ADD COLUMN "accountId" character varying(255)'),
        db.runSql.bind(db, 'ALTER TABLE ONLY challenges ADD COLUMN "source" text'),
        db.runSql.bind(db, 'ALTER TABLE ONLY challenges ADD COLUMN "sourceId" text'),
        // scorecard item table edit
        db.runSql.bind(db, 'ALTER TABLE ONLY scorecard_items DROP COLUMN "requirementText"'),
    ], callback);
};

exports.down = function(db, callback) {
    async.series([
        db.runSql.bind(db, 'ALTER TABLE ONLY challenges drop COLUMN prizes'),
        db.runSql.bind(db, 'ALTER TABLE ONLY challenges drop COLUMN account'),
        db.runSql.bind(db, 'ALTER TABLE ONLY challenges drop COLUMN "accountId"'),
        db.runSql.bind(db, 'ALTER TABLE ONLY challenges drop COLUMN "source"'),
        db.runSql.bind(db, 'ALTER TABLE ONLY challenges drop COLUMN "sourceId"'),
    ], callback);
};
