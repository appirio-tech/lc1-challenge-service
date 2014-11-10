var dbm = require('db-migrate');
var async = require('async');
var type = dbm.dataType;

exports.up = function (db, callback) {
  async.series([
    // challenges table
    db.createTable('challenges', {
      id: { type: 'int', primaryKey: true, autoIncrement: true, notNull: true },
      reg_start_at: { type: 'timestamp' },
      sub_end_at: { type: 'timestamp' },
      completed_at: { type: 'timestamp' },
      title: { type: 'text', notNull: true, defaultValue: "Untitled Challenge" },
      overview: { type: 'string', length: 140 },
      description: { type: 'text' },
      account: { type: 'string', length: 255 },
      account_id: { type: 'string', length: 255 },
      source: { type: 'text' },
      source_id: { type: 'text' },
      created_at: { type: 'timestamp', notNull: true },
      updated_at: { type: 'timestamp', notNull: true },
      created_by: { type: 'string', length: 128 },
      updated_by: { type: 'string', length: 128 }
    }, function(a) {
      db.runSql.bind(db,
        "ALTER TABLE challenges ADD COLUMN tags text[]," +
        "ADD COLUMN prizes NUMERIC(11, 2)[]," +
        "ADD COLUMN status enum_challenges_status NOT NULL;");
    }),
      
    // files table
    db.createTable('files', {
      'id': { type: 'int', primaryKey: true, autoIncrement: true, notNull: true },
      'title': { type: 'text' },
      'file_path': { type: 'text', notNull: true },
      'size': { type: 'bigint', notNull: true },
      'file_name': { type: 'text', notNull: true },
      'created_at': { type: 'timestamp', notNull: true },
      'updated_at': { type: 'timestamp', notNull: true },
      'created_by': { type: 'string', length: 128 },
      'updated_by': { type: 'string', length: 128 },
      'submission_id': { type: 'bigint' },
      'challenge_id': { type: 'bigint', notNull: true}
    }, function(a) {
      db.runSql.bind(db,
        'ALTER TABLE files ADD COLUMN storage_location enum_files_storage_location NOT_NULL');
    }),

    // participants table
    db.createTable('participants', {
      'id': { type: 'int', primaryKey: true, autoIncrement: true, notNull: true },
      'created_at': { type: 'timestamp', notNull: true },
      'updated_at': { type: 'timestamp', notNull: true },
      'created_by': { type: 'string', length: 128 },
      'updated_by': { type: 'string', length: 128 },
      'challenge_id': { type: 'bigint', notNull: true },
      'user_id': { type: 'bigint', notNull: true }
    }, function(a) {
      db.runSql.bind(db,
        'ALTER TABLE files ADD COLUMN role enum_participants_role NOT_NULL');
    }),

    // submissions table
    db.createTable('submissions', {
      'id': { type: 'int', primaryKey: true, autoIncrement: true, notNull: true },
      'created_at': { type: 'timestamp', notNull: true },
      'updated_at': { type: 'timestamp', notNull: true },
      'created_by': { type: 'string', length: 128 },
      'updated_by': { type: 'string', length: 128 },
      'challenge_id': { type: 'bigint', notNull: true },
      'submitter_id': { type: 'bigint', notNull: true }
    }),

    // scorecards table
    db.createTable('scorecards', {
      'id': { type: 'int', primaryKey: true, autoIncrement: true, notNull: true },
      'score_sum': { type: 'int' },
      'score_percent': { type: 'decimal' },
      'score_max': { type: 'decimal' },
      'pay': { type: 'boolean' },
      'place': { type: 'int' },
      'prize': { type: 'decimal' },
      'created_at': { type: 'timestamp', notNull: true },
      'updated_at': { type: 'timestamp', notNull: true },
      'created_by': { type: 'string', length: 128 },
      'updated_by': { type: 'string', length: 128 },
      'reviewer_id': { type: 'bigint', notNull: true },
      'submission_id': { type: 'bigint', notNull: true },
      'challenge_id': { type: 'bigint', notNull: true }
    }, function(a) {
      db.runSql.bind(db, 'ALTER TABLE scorecards ADD COLUMN status enum_scorecards_status');
    }),

    // scorecard_items table
    db.createTable('scorecard_items', {
      'id': { type: 'int', primaryKey: true, autoIncrement: true, notNull: true },
      'requirement_id': { type: 'int' },
      'score': { type: 'decimal' },
      'comment': { type: 'text' },
      'created_at': { type: 'timestamp', notNull: true },
      'updated_at': { type: 'timestamp', notNull: true },
      'created_by': { type: 'string', length: 128 },
      'updated_by': { type: 'string', length: 128 },
      'scorecard_id': { type: 'bigint', notNull: true }
    }),

    // requirements table
    db.createTable('requirements', {
      'id': { type: 'int', primaryKey: true, autoIncrement: true, notNull: true },
      'requirement_text': { type: 'text' },
      'created_at': { type: 'timestamp', notNull: true },
      'updated_at': { type: 'timestamp', notNull: true }
    }, function(a) {
      db.runSql.bind(db, 'ALTER TABLE requirements ADD COLUMN challenge_id bigint NOT NULL REFERENCES challenges("id") ON UPDATE CASCADE ON DELETE SET NULL;');
    }),

    // users table
    db.createTable('users', {
      'id': { type: 'int', primaryKey: true, autoIncrement: true, notNull: true },
      'name': { type: 'text' },
      'email': { type: 'text' },
      'created_at': { type: 'timestamp', notNull: true },
      'updated_at': { type: 'timestamp', notNull: true },
      'created_by': { type: 'string', length: 128 },
      'updated_by': { type: 'string', length: 128 }
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
