var dbm = require('db-migrate');
var async = require('async');
var type = dbm.dataType;

exports.up = function (db, callback) {
  async.series([
    // challenges table
    db.runSql.bind(db,
      'CREATE TABLE challenges ( ' +
        'id bigserial NOT NULL, ' +
        '"reg_start_at" timestamp with time zone, ' +
        '"sub_end_at" timestamp with time zone, ' +
        '"completed_at" timestamp with time zone, ' +
        'title text NOT NULL DEFAULT \'Untitled Challenge\'::text, ' +
        'overview character varying(140), ' +
        'description text, ' +
        'tags text[], ' +
        'prizes NUMERIC(11,2)[], ' +
        'account character varying(255), ' +
        '"account_id" character varying(255), ' +
        '"source" text, ' +
        '"source_id" text, ' +
        'status enum_challenges_status NOT NULL, ' +
        '"created_at" timestamp with time zone NOT NULL, ' +
        '"updated_at" timestamp with time zone NOT NULL, ' +
        '"created_by" character varying(128), ' +
        '"updated_by" character varying(128) ' +
      ');'),
    db.runSql.bind(db, 'ALTER TABLE ONLY challenges ADD CONSTRAINT challenges_pkey PRIMARY KEY (id);'),

    // files table
    db.runSql.bind(db,
      'CREATE TABLE files ( ' +
        'id bigserial NOT NULL, ' +
        'title text, ' +
        '"file_path" text NOT NULL, ' +
        'size bigint NOT NULL, ' +
        '"file_name" text NOT NULL, ' +
        '"storage_location" "enum_files_storage_location" NOT NULL, ' +
        '"created_at" timestamp with time zone NOT NULL, ' +
        '"updated_at" timestamp with time zone NOT NULL, ' +
        '"created_by" character varying(128), ' +
        '"updated_by" character varying(128), ' +
        '"submission_id" bigint, ' +
        '"challenge_id" bigint NOT NULL ' +
      ');'),
    db.runSql.bind(db, 'ALTER TABLE ONLY files ADD CONSTRAINT files_pkey PRIMARY KEY (id);'),

    // participants table
    db.runSql.bind(db,
      'CREATE TABLE participants ( ' +
        'id bigserial NOT NULL, ' +
        'role enum_participants_role NOT NULL, ' +
        '"created_at" timestamp with time zone NOT NULL, ' +
        '"updated_at" timestamp with time zone NOT NULL, ' +
        '"created_by" character varying(128), ' +
        '"updated_by" character varying(128), ' +
        '"challenge_id" bigint NOT NULL, ' +
        '"user_id" bigint NOT NULL ' +
      ');'),
    db.runSql.bind(db, 'ALTER TABLE ONLY participants ADD CONSTRAINT participants_pkey PRIMARY KEY (id);'),

    // submissions table
    db.runSql.bind(db,
      'CREATE TABLE submissions ( ' +
        'id bigserial NOT NULL, ' +
        '"created_at" timestamp with time zone NOT NULL, ' +
        '"updated_at" timestamp with time zone NOT NULL, ' +
        '"created_by" character varying(128), ' +
        '"updated_by" character varying(128), ' +
        '"challenge_id" bigint NOT NULL, ' +
        '"submitter_id" bigint NOT NULL ' +
      ');'),
    db.runSql.bind(db, 'ALTER TABLE ONLY submissions ADD CONSTRAINT submissions_pkey PRIMARY KEY (id);'),

    // scorecards table
    db.runSql.bind(db,
      'CREATE TABLE scorecards ( ' +
        'id bigserial NOT NULL, ' +
        '"score_sum" integer, ' +
        '"score_percent" double precision, ' +
        '"score_max" double precision, ' +
        'status enum_scorecards_status, ' +
        'pay boolean, ' +
        'place integer, ' +
        'prize double precision, ' +
        '"created_at" timestamp with time zone NOT NULL, ' +
        '"updated_at" timestamp with time zone NOT NULL, ' +
        '"created_by" character varying(128), ' +
        '"updated_by" character varying(128), ' +
        '"reviewer_id" bigint NOT NULL, ' +
        '"submission_id" bigint NOT NULL, ' +
        '"challenge_id" bigint NOT NULL ' +
      ');'),
    db.runSql.bind(db, 'ALTER TABLE ONLY scorecards ADD CONSTRAINT scorecards_pkey PRIMARY KEY (id);'),

    // scorecard_items table
    db.runSql.bind(db,
      'CREATE TABLE scorecard_items ( ' +
        'id bigserial NOT NULL, ' +
        '"requirement_id" integer, ' +
        'score double precision, ' +
        'comment text, ' +
        '"created_at" timestamp with time zone NOT NULL, ' +
        '"updated_at" timestamp with time zone NOT NULL, ' +
        '"created_by" character varying(128), ' +
        '"updated_by" character varying(128), ' +
        '"scorecard_id" bigint NOT NULL ' +
      ');'),
    db.runSql.bind(db, 'ALTER TABLE ONLY scorecard_items ADD CONSTRAINT scorecard_items_pkey PRIMARY KEY (id);'),

    // requirements table
    db.runSql.bind(db,
      'CREATE TABLE requirements ( ' +
      'id bigserial NOT NULL, ' +
      '"requirement_text" text, ' +
      '"challenge_id" bigint NOT NULL REFERENCES challenges("id") ON UPDATE CASCADE ON DELETE SET NULL, ' +
      '"created_at" timestamp with time zone NOT NULL, ' +
      '"updated_at" timestamp with time zone NOT NULL ' +
      ');'),

    // users table
    db.runSql.bind(db,
      'CREATE TABLE users ( ' +
        'id bigserial NOT NULL, ' +
        'name text, ' +
        'email text, ' +
        '"created_at" timestamp with time zone NOT NULL, ' +
        '"updated_at" timestamp with time zone NOT NULL, ' +
        '"created_by" character varying(128), ' +
        '"updated_by" character varying(128) ' +
      ');'),
    db.runSql.bind(db, 'ALTER TABLE ONLY users ADD CONSTRAINT users_pkey PRIMARY KEY (id);')

  ], callback);
};

exports.down = function (db, callback) {
  async.series([
    db.dropTable.bind(db, 'users'),
    db.dropTable.bind(db, 'requirements'),
    db.dropTable.bind(db, 'scorecard_items'),
    db.dropTable.bind(db, 'scorecards'),
    db.dropTable.bind(db, 'submissions'),
    db.dropTable.bind(db, 'participants'),
    db.dropTable.bind(db, 'files'),
    db.dropTable.bind(db, 'challenges')
  ], callback);
};