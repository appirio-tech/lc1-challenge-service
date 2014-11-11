var dbm = require('db-migrate');
var async = require('async');
var type = dbm.dataType;

exports.up = function (db, callback) {
  async.series([
    // challenges table
    db.createTable.bind(db, 'challenges', {
      id: { type: 'int', primaryKey: true, autoIncrement: true },
      reg_start_at: 'datetime',
      sub_end_at: 'datetime',
      completed_at: 'datetime',
      title: { type: 'text', notNull: true },
      overview: { type: 'string', length: 140 },
      description: 'text',
      account: { type: 'string', length: 255 },
      account_id: { type: 'string', length: 255 },
      source: 'text',
      source_id: 'text',
      created_at: { type: 'datetime', notNull: true },
      updated_at: { type: 'datetime', notNull: true },
      created_by: { type: 'string', length: 128 },
      updated_by: { type: 'string', length: 128 }
    }),
    db.runSql.bind(db, 'ALTER TABLE challenges ADD COLUMN tags text[];'),
    db.runSql.bind(db, 'ALTER TABLE challenges ADD COLUMN prizes NUMERIC(11,2)[];'),
    db.runSql.bind(db, 'ALTER TABLE challenges ADD COLUMN status enum_challenges_status NOT NULL;'),

    // files table
    db.createTable.bind(db, 'files', {
      id: { type: 'int', primaryKey: true, autoIncrement: true },
      title: 'text',
      file_path: { type: 'text', notNull: true },
      size: { type: 'bigint', notNull: true },
      file_name: { type: 'text', notNull: true },
      created_at: { type: 'datetime', notNull: true },
      updated_at: { type: 'datetime', notNull: true },
      created_by: { type: 'string', length: 128 },
      updated_by: { type: 'string', length: 128 },
      submission_id: 'bigint',
      challenge_id: { type: 'bigint', notNull: true }
    }),
    db.runSql.bind(db, 'ALTER TABLE files ADD COLUMN storage_location enum_files_storage_location NOT NULL;'),

    // participants table
    db.createTable.bind(db, 'participants', {
      id: { type: 'int', primaryKey: true, autoIncrement: true },
      created_at: { type: 'datetime', notNull: true },
      updated_at: { type: 'datetime', notNull: true },
      created_by: { type: 'string', length: 128 },
      updated_by: { type: 'string', length: 128 },
      challenge_id: { type: 'bigint', notNull: true },
      user_id: { type: 'bigint', notNull: true }
    }),
    db.runSql.bind(db, 'ALTER TABLE participants ADD COLUMN role enum_participants_role NOT NULL;'),

    // submissions table
    db.createTable.bind(db, 'submissions', {
      id: { type: 'int', primaryKey: true, autoIncrement: true },
      created_at: { type: 'datetime', notNull: true },
      updated_at: { type: 'datetime', notNull: true },
      created_by: { type: 'string', length: 128 },
      updated_by: { type: 'string', length: 128 },
      challenge_id: { type: 'bigint', notNull: true },
      submitter_id: { type: 'bigint', notNull: true }
    }),

    // scorecards table
    db.createTable.bind(db, 'scorecards', {
      id: { type: 'int', primaryKey: true, autoIncrement: true },
      score_sum: 'int',
      pay: 'boolean',
      place: 'int',
      created_at: { type: 'datetime', notNull: true },
      updated_at: { type: 'datetime', notNull: true },
      created_by: { type: 'string', length: 128 },
      updated_by: { type: 'string', length: 128 },
      reviewer_id: { type: 'bigint', notNull: true },
      submission_id: { type: 'bigint', notNull: true },
      challenge_id: { type: 'bigint', notNull: true }
    }),
    db.runSql.bind(db, 'ALTER TABLE scorecards ADD COLUMN score_percent double precision;'),
    db.runSql.bind(db, 'ALTER TABLE scorecards ADD COLUMN score_max double precision;'),
    db.runSql.bind(db, 'ALTER TABLE scorecards ADD COLUMN status enum_scorecards_status;'),
    db.runSql.bind(db, 'ALTER TABLE scorecards ADD COLUMN prize double precision;'),

    // scorecard_items table
    db.createTable.bind(db, 'scorecard_items', {
      id: {type: 'int', primaryKey: true, autoIncrement: true},
      requirement_id: 'int',
      comment: 'text',
      created_at: { type: 'datetime', notNull: true },
      updated_at: { type: 'datetime', notNull: true },
      created_by: { type: 'string', length: 128 },
      updated_by: { type: 'string', length: 128 },
      scorecard_id: { type: 'bigint', notNull: true }
    }),
    db.runSql.bind(db, 'ALTER TABLE scorecard_items ADD COLUMN score double precision;'),

    // requirements table
    db.createTable.bind(db, 'requirements', {
      id: {type: 'int', primaryKey: true, autoIncrement: true},
      requirement_text: 'text',
      challenge_id: { type: 'bigint', notNull: true },
      created_at: { type: 'datetime', notNull: true },
      updated_at: { type: 'datetime', notNull: true }
    }),
    db.runSql.bind(db, 'ALTER TABLE requirements ADD CONSTRAINT requirements_challenge_fk FOREIGN KEY (challenge_id) REFERENCES challenges (id) ON UPDATE CASCADE ON DELETE SET NULL;'),

    // users table
    db.createTable.bind(db, 'users', {
      id: {type: 'int', primaryKey: true, autoIncrement: true},
      name: 'text',
      email: 'text',
      created_at: { type: 'datetime', notNull: true },
      updated_at: { type: 'datetime', notNull: true },
      created_by: { type: 'string', length: 128 },
      updated_by: { type: 'string', length: 128 }
    }),
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