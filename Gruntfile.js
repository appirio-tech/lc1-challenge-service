'use strict';

module.exports = function(grunt) {
  var databaseUrl;

  var re;
  var swagger;
  var swaggerFile = __dirname + '/api/swagger/swagger.yaml';

  var paths = {
    js: ['*.js', 'api/**/*.js', 'lib/*.js', '!test/coverage/**', '!bower_components/**', '!newrelic.js']
  };

  if (process.env.NODE_ENV !== 'production') {
    require('time-grunt')(grunt);
  }

  var envConfig = require('config');

  // @TODO setup test heroku so we don't need this
  if (envConfig.has('app.pgURLWercker')) {
    databaseUrl = envConfig.get('app.pgURLWercker');
  } else if (envConfig.has('app.pgURL')) {
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
        'migrations-dir': 'config/schema-migrations', // defines the dir for the migration scripts
        verbose: true   // tell me more stuff
      }
    },
    'swagger-js-codegen': {
      options: {
        apis: [
          {
            swagger: 'http://lc1-challenge-service.herokuapp.com/api-docs',  // The location of the swagger file
            moduleName: 'Challenge' // The name of the file and class
          }
        ],
        dest: 'lib' // Where the file should be generated.
      },
      dist: {

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

  grunt.registerTask('validate', ['env:test', 'mochaTest', 'jshint']);

  //Test task.
  grunt.registerTask('test', ['env:test', 'dbmigrate', 'mochaTest', 'yamlTest', 'jshint']);

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

    // Run the validator on file at swaggerFile
    console.log('YAML Test for file: ' + swaggerFile + '\n');
    re = swagger.validator.Validate(swaggerFile, undefined, {version: '2.0'});

  } catch (e) { re = e.message; }

    // If has error, result in console
    console.log('YAML 2.0 RESULT: ' + re + '\n');
  });

  grunt.registerTask('cleandb', 'Clean db and re-apply all migrations', function () {
    var fs = require('fs');
    var files = fs.readdirSync('./config/schema-migrations');
    if (files) {
      files.forEach(function() {
        grunt.task.run('migrate:down');
      });
      grunt.task.run('migrate:up');
    }
  });

  grunt.registerTask('updateClient', ['swagger-js-codegen']);
};

