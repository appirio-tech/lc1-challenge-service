var dbm = require('db-migrate');
var async = require('async');
var type = dbm.dataType;

exports.up = function (db, callback) {
  async.series([
    // challenges table
    db.runSql.bind(db,
      'CREATE TABLE challenges ( ' +
        'id bigserial NOT NULL, ' +
        '"regStartAt" timestamp with time zone, ' +
        '"subEndAt" timestamp with time zone, ' +
        '"completedAt" timestamp with time zone, ' +
        'title text NOT NULL DEFAULT \'Untitled Challenge\'::text, ' +
        'overview character varying(140), ' +
        'description text, ' +
        'tags text[], ' +
        'prizes NUMERIC(11,2)[], ' +
        '"source" text, ' +
        '"sourceId" text, ' +
        'status enum_challenges_status NOT NULL, ' +
        '"createdAt" timestamp with time zone NOT NULL, ' +
        '"updatedAt" timestamp with time zone NOT NULL, ' +
        '"createdBy" bigint, ' +
        '"updatedBy" bigint, ' +
        '"projectId" character varying(255), ' +
        '"projectSource" enum_challenges_projectSource ' +
      ');'),
    db.runSql.bind(db, 'ALTER TABLE ONLY challenges ADD CONSTRAINT challenges_pkey PRIMARY KEY (id);'),

    // files table
    db.runSql.bind(db,
      'CREATE TABLE files ( ' +
        'id bigserial NOT NULL, ' +
        'title text, ' +
        'size bigint NOT NULL, ' +
        '"storageLocation" text NOT NULL, ' +
        '"fileUrl" text NOT NULL, ' +
        '"createdAt" timestamp with time zone NOT NULL, ' +
        '"updatedAt" timestamp with time zone NOT NULL, ' +
        '"createdBy" bigint, ' +
        '"updatedBy" bigint ' +
      ');'),
    db.runSql.bind(db, 'ALTER TABLE ONLY files ADD CONSTRAINT files_pkey PRIMARY KEY (id);'),

    // participants table
    db.runSql.bind(db,
      'CREATE TABLE participants ( ' +
        'id bigserial NOT NULL, ' +
        'role enum_participants_role NOT NULL, ' +
        '"userHandle" character varying(128), ' +
        '"createdAt" timestamp with time zone NOT NULL, ' +
        '"updatedAt" timestamp with time zone NOT NULL, ' +
        '"createdBy" bigint, ' +
        '"updatedBy" bigint, ' +
        '"challengeId" bigint NOT NULL, ' +
        '"userId" bigint NOT NULL ' +
      ');'),
    db.runSql.bind(db, 'ALTER TABLE ONLY participants ADD CONSTRAINT participants_pkey PRIMARY KEY (id);'),

    // submissions table
    db.runSql.bind(db,
      'CREATE TABLE submissions ( ' +
        'id bigserial NOT NULL, ' +
        'status enum_submissions_status NOT NULL, ' +
        '"submitterHandle" character varying(128), ' +
        '"createdAt" timestamp with time zone NOT NULL, ' +
        '"updatedAt" timestamp with time zone NOT NULL, ' +
        '"createdBy" bigint, ' +
        '"updatedBy" bigint, ' +
        '"challengeId" bigint NOT NULL, ' +
        '"submitterId" bigint NOT NULL ' +
      ');'),
    db.runSql.bind(db, 'ALTER TABLE ONLY submissions ADD CONSTRAINT submissions_pkey PRIMARY KEY (id);'),

    // scorecards table
    db.runSql.bind(db,
      'CREATE TABLE scorecards ( ' +
        'id bigserial NOT NULL, ' +
        '"scoreSum" integer, ' +
        '"scorePercent" double precision, ' +
        '"scoreMax" double precision, ' +
        'status enum_scorecards_status, ' +
        'pay boolean, ' +
        'place integer, ' +
        'prize double precision, ' +
        '"createdAt" timestamp with time zone NOT NULL, ' +
        '"updatedAt" timestamp with time zone NOT NULL, ' +
        '"createdBy" bigint, ' +
        '"updatedBy" bigint, ' +
        '"reviewerId" bigint NOT NULL, ' +
        '"reviewerHandle" character varying(128), ' +
        '"submissionId" bigint NOT NULL, ' +
        '"challengeId" bigint NOT NULL ' +
      ');'),
    db.runSql.bind(db, 'ALTER TABLE ONLY scorecards ADD CONSTRAINT scorecards_pkey PRIMARY KEY (id);'),

    // scorecard_items table
    db.runSql.bind(db,
      'CREATE TABLE scorecard_items ( ' +
        'id bigserial NOT NULL, ' +
        '"requirementId" integer, ' +
        'score double precision, ' +
        'comment text, ' +
        '"createdAt" timestamp with time zone NOT NULL, ' +
        '"updatedAt" timestamp with time zone NOT NULL, ' +
        '"createdBy" bigint, ' +
        '"updatedBy" bigint, ' +
        '"scorecardId" bigint NOT NULL ' +
      ');'),
    db.runSql.bind(db, 'ALTER TABLE ONLY scorecard_items ADD CONSTRAINT scorecard_items_pkey PRIMARY KEY (id);'),

    // requirements table
    db.runSql.bind(db,
      'CREATE TABLE requirements ( ' +
      'id bigserial NOT NULL, ' +
      '"requirementText" text, ' +
      '"challengeId" bigint NOT NULL REFERENCES challenges("id") ON UPDATE CASCADE ON DELETE SET NULL, ' +
      '"createdAt" timestamp with time zone NOT NULL, ' +
      '"updatedAt" timestamp with time zone NOT NULL, ' +
      '"createdBy" bigint, ' +
      '"updatedBy" bigint ' +
      ');')


  ], callback);
};

exports.down = function (db, callback) {
  async.series([
    db.dropTable.bind(db, 'requirements'),
    db.dropTable.bind(db, 'scorecard_items'),
    db.dropTable.bind(db, 'scorecards'),
    db.dropTable.bind(db, 'submissions'),
    db.dropTable.bind(db, 'participants'),
    db.dropTable.bind(db, 'files'),
    db.dropTable.bind(db, 'challenges')
  ], callback);
};