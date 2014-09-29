'use strict';

module.exports = function(grunt) {
  var databaseUrl;

  if (process.env.NODE_ENV !== 'production') {
    require('time-grunt')(grunt);
  }

  var envConfig = require('config');
  databaseUrl = envConfig.pgURL ||
      'postgres://' + envConfig.pg.username + ':' + envConfig.pg.password + '@' + envConfig.pg.host + ':5432/' + envConfig.pg.database;


  // Project Configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      js: {
        files: paths.js,
        tasks: ['jshint']
      }
    },
    jshint: {
      all: {
        src: paths.js,
        options: {
          jshintrc: true
        }
      }
    },
    nodemon: {
      dev: {
        script: 'app.js',
        options: {
          args: [],
          ignore: ['node_modules/**'],
          ext: 'js,html',
          nodeArgs: ['--debug'],
          delayTime: 1,
          cwd: __dirname
        }
      }
    },
    concurrent: {
      tasks: ['nodemon', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },
    migrate: {
      options: {
        env: {
          DATABASE_URL: databaseUrl   // the databaseUrl is resolved at the beginning based on the NODE_ENV, this value injects the config in the database.json
        },
        'dir': 'config/schema-migrations', // defines the dir for the migration scripts
        verbose: true   // tell me more stuff
      }
    },
    env: {
      test: {
        NODE_ENV: 'test'
      },
      local: {
        NODE_ENV: 'local'
      }
    }
  });

  //Load NPM tasks
  require('load-grunt-tasks')(grunt);

  //Default task(s).
  if (process.env.NODE_ENV === 'production') {
    grunt.registerTask('default', ['jshint', 'concurrent']);
  } else {
    grunt.registerTask('default', ['env:local', 'jshint', 'concurrent']);
  }

  //Test task.
  grunt.registerTask('test', ['env:test', 'mochaTest']);

  // For Heroku users only.
  grunt.registerTask('heroku:production', ['jshint']);

  // db migrate
  grunt.registerTask('dbmigrate', 'db up all the appliable scripts', function () {
    grunt.task.run('migrate:up');
  });
};
