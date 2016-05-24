/*
 * grunt-nodemailer
 * https://github.com/dwightjack/grunt-nodemailer
 *
 * Copyright (c) 2013-2016 Marco Solazzi
 * Licensed under the MIT license.
 */

'use strict';

/* eslint-disable func-names, camelcase */
module.exports = function (grunt) {

    var filestubTransport = require('./tasks/transports/fake');

    // Project configuration.
    grunt.initConfig({
        eslint: {
            all: {
                src: [
                    'Gruntfile.js',
                    'tasks/*.js',
                    '<%= nodeunit.tests %>'
                ]
            }
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp']
        },

        //Configuration to be run (and then tested).
        nodemailer: {

            options: {
                transport: filestubTransport,
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
            },

            external_sources_txt: {
                options: {
                    subject: 'external_sources_txt',
                    message: {
                        subject: 'external_sources_txt',
                        text: 'test fallback txt'
                    }
                },
                src: ['test/fixtures/email-body-as-txt.txt']
            },

            external_sources_md: {
                options: {
                    subject: 'external_sources_md',
                    message: {
                        subject: 'external_sources_md',
                        text: 'test fallback md'
                    }
                },
                src: ['test/fixtures/*.md']
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-eslint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'nodemailer', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['eslint', 'test']);

};
/* eslint-enable func-names, camelcase */