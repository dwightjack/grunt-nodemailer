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
    }

    // Configuration to be run (and then tested).
    // nodemailer: {
    //   default_options: {
    //     options: {
    //     },
    //     files: {
    //       'tmp/default_options': ['test/fixtures/testing', 'test/fixtures/123'],
    //     },
    //   },
    //   custom_options: {
    //     options: {
    //       separator: ': ',
    //       punctuation: ' !!!',
    //     },
    //     files: {
    //       'tmp/custom_options': ['test/fixtures/testing', 'test/fixtures/123'],
    //     },
    //   },
    // }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint']);

};
