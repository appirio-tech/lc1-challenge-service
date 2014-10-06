'use strict';

module.exports = function(grunt) {
  var databaseUrl;

  var re;
  var swagger;
  var swagger_file = __dirname + '/api/swagger/swagger.yaml';

  var paths = {
    js: ['*.js', 'api/**/*.js', '!test/coverage/**', '!bower_components/**']
  };

  if (process.env.NODE_ENV !== 'production') {
    require('time-grunt')(grunt);
  }

  var envConfig = require('config');

  if (envConfig.has('app.pgURL')) {
    databaseUrl = envConfig.get('app.pgURL');
  } else {
    databaseUrl =  'postgres://' + envConfig.get('app.pg.username') +
    ':' + envConfig.get('app.pg.password') +
    '@' + envConfig.get('app.pg.host') +
    ':' + envConfig.get('app.pg.port') +
    '/' + envConfig.get('app.pg.database');
  }



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
          reporter: 'spec',
          require: [
            'app.js'
          ]
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
        NODE_ENV: 'test',
        A127_APPROOT: __dirname
      },
      local: {
        NODE_ENV: 'local'
      }
    }
  });

  //Load NPM tasks
  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('grunt-contrib-jshint');

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
  grunt.registerTask('dbmigrate', 'db up all the applicable scripts', function () {
    grunt.task.run('migrate:up');
  });  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('dbdown', 'db down all the applicable scripts', function () {
    grunt.task.run('migrate:down');
  });

  // yaml tester for ./api/swagger/swagger.yaml
  grunt.task.registerTask('yamlTest', 'Test Swagger spec file', function() {

  // load the grunt-swagger-tools
  try {
    // https://www.npmjs.org/package/grunt-swagger-tools
    swagger = require('grunt-swagger-tools')();

    // // Setup 2.0 Swagger spec compliant using YAML format
    swagger.validator.set('fileext', '.yaml');

    // No logging of loaded YAML data
    swagger.validator.set('log', 'true');

    // Run the validator on file at swagger_file
    console.log('YAML Test for file: ' + swagger_file + '\n');
    re = swagger.validator.Validate(swagger_file, undefined, {version: '2.0'});

  } catch (e) { re = e.message; }

    // If has error, result in console
    console.log('YAML 2.0 RESULT: ' + re + '\n');
  });

};

