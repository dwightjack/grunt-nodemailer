/*
 * grunt-nodemailer
 * https://github.com/dwightjack/grunt-nodemailer
 *
 * Copyright (c) 2013-2016 Marco Solazzi
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    var path = require('path'),
        util = require('util'),
        _ = require('lodash'),
        async = require('async'),
        nodemailer = require('nodemailer'),
        sendmailTransport;


    try {
        sendmailTransport = require('nodemailer-sendmail-transport');
    } catch (e) {
        sendmailTransport = require('nodemailer/node_modules/nodemailer-sendmail-transport');
    }

    grunt.registerMultiTask('nodemailer', 'Grunt wrapper for Nodemailer', function taskRegistration() {
        var done = this.async(),
            messages = [],
            options = this.options({
                transport: null,
                message: {},
                recipients: [],
                from: '', //DEPRECATED
                subject: '', //DEPRECATED
                html: '', //DEPRECATED
                text: '' //DEPRECATED
            }),
            defaultMessage,
            transport,
            files;

        defaultMessage = _.defaults(options.message, {
            to: [],
            from: 'nodemailer <sender@example.com>',
            subject: '',
            html: '',
            text: ''
        });
        // Override files provided in gruntfile if filepath added in grunt command
        files = grunt.option('fileSrc') ? [grunt.option('fileSrc')] : this.filesSrc;

        //ensure recipients are an array
        if (!Array.isArray(defaultMessage.to)) {
            defaultMessage.to = defaultMessage.to.split(',');
        }

        if (options.transport) {
            transport = nodemailer.createTransport(options.transport);
        } else {
            transport = nodemailer.createTransport(sendmailTransport);
        }

        _.each(options.recipients, function recipientsIterator(el) {
            var args = ['"%s" <%s>'];
            if (typeof el === 'string') {
                args.push(el, el);
            } else {
                args.push(el.name, el.email);
            }
            defaultMessage.to.push(util.format.apply(null, args));
        });

        if (defaultMessage.to.length < 1) {
            grunt.fail.fatal('No recipient provided.');
        }

        //process deprecated options
        //TODO: remove in next version
        _.each(['from', 'subject', 'html', 'text'], function propIterator(prop) {
            if (!_.isEmpty(options[prop])) {
                grunt.verbose.writeln(('Option "' + prop + '" is DEPRECATED. Please, set "message.' + prop + '" instead.').yellow);
                defaultMessage[prop] = options[prop];
            }
        });


        if (files.length) {
            //When a file array is provided, use sources
            //as HTML/TXT message input
            //Multiple sources files will generate multiple messages
            messages = _.map(files, function filesIterator(f) {
                var ext,
                    txtFile,
                    newMsg = false;

                if (grunt.file.isFile(f)) {

                    ext = path.extname(f);

                    if (/^\.html?$/i.test(ext)) {

                        newMsg = _.clone(defaultMessage);
                        newMsg.html = grunt.file.read(f);

                        //override subject with HTML title tag
                        if (/<title>([^<]+)<\/title>/i.test(newMsg.html)) {
                            newMsg.subject = newMsg.html.match(/<title>([^<]+)<\/title>/i)[1];
                        }

                        //when dealing with .html files, lookup for txt files with same filename
                        txtFile = path.join(path.dirname(f), path.basename(f, ext) + '.txt');
                        if (grunt.file.isFile(txtFile)) {
                            newMsg.text = grunt.file.read(txtFile);
                        }

                    } else {
                        newMsg = _.clone(defaultMessage);
                        newMsg.text = grunt.file.read(f);
                    }

                }

                return newMsg;

            });

        } else {
            messages.push(defaultMessage);
        }


        grunt.log.writeln(util.format('Sending %d e-mail%s to recipients: %s', messages.length, (messages.length > 1 ? 's' : ''), defaultMessage.to.join(', ')));

        //Sending messages in series (which is slower) since some
        //services may limit concurrent connections.
        async.eachSeries(messages, function asyncFn(msg, next) {
            transport.sendMail(msg, function sendCb(error/*, responseStatus*/) {
                if (error) {
                    grunt.verbose.errorlns(JSON.stringify(error));
                    grunt.fail.fatal('Error occured: ' + error.message);
                    next(error);
                    return;
                }
                grunt.log.writeln(('Message sent successfully.').green);
                next(null);
            });
        }, done);


    });

};