/*
 * grunt-nodemailer
 * https://github.com/dwightjack/grunt-nodemailer
 *
 * Copyright (c) 2013 Marco Solazzi
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    //Configuration to be run (and then tested).
    nodemailer: {

      options: {
        transport: {
          type: 'filestub'
        },
        recipients: ['john.doe@gmail.com']
      },

      simple_message: {
        options: {
          message: {
            subject: 'simple_message',
            html: '<h1>Test Message</h1>',
            text: 'test fallback'
          }
        }
      },

      mixed_recipients: {
        options: {
          message: {
            subject: 'mixed_recipients',
            html: '<h1>Test Message</h1>',
            text: 'test fallback',
            to: 'myself@gmail.com'
          },
          recipients: [{
            name: 'John Doe',
            email: 'john.doe@gmail.com'
          }]
        }
      },

      external_sources: {
        options: {
          subject: 'external_sources',
          message: {
            subject: 'external_sources',
            html: '<h1>Test Message</h1>',
            text: 'test fallback'
          }
        },
        src: ['test/fixtures/*.html']
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'nodemailer', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
