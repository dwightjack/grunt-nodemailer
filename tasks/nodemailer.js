/*
 * grunt-nodemailer
 * https://github.com/dwightjack/grunt-nodemailer
 *
 * Copyright (c) 2013 Marco Solazzi
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  var path = require('path'),
      util = require('util'),
      _ = require('lodash'),
      async = require('async'),
      nodemailer = require('nodemailer');

  //used for testing purpouse
  nodemailer.Transport.transports.FILESTUB = require('./transports/fake');

  grunt.registerMultiTask('nodemailer', 'Grunt wrapper for Nodemailer', function() {
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
      subject;

    defaultMessage = _.defaults(options.message, {
        to: [],
        from: 'nodemailer <sender@example.com>',
        subject: '',
        html: '',
        text: ''
    });

    //ensure recipients are an array
    if (!Array.isArray(defaultMessage.to)) {
      defaultMessage.to = defaultMessage.to.split(',');
    }

    if (_.isObject(options.transport)) {
      //check if a valid transport has been provided...
      if (!_.has(options.transport, 'type') || Object.keys(nodemailer.Transport.transports).indexOf(options.transport.type.toString().trim().toUpperCase()) === -1) {
        grunt.fail.fatal('Invalid Nodemailer trasnport type. Valid are: ' + nodemailer.Transport.transports.join(','));
        return;
      }
      transport = nodemailer.createTransport(options.transport.type, options.transport.options || {});
    } else {
      transport = nodemailer.createTransport("sendmail");
    }

    _.each(options.recipients, function(el) {
      var args = ['"%s" <%s>'];
      if (typeof el === 'string') {
        args.push(el, el);
      } else {
        args.push(el.name, el.email);
      }
      defaultMessage.to.push( util.format.apply(null, args) );
    });

    if (defaultMessage.to.length < 1) {
      grunt.fail.fatal('No recipient provided.');
    }

    //process deprecated options
    //TODO: remove in next version
    _.each(['from','subject','html','text'], function (prop) {
      if (!_.isEmpty(options[prop])) {
        grunt.verbose.writeln(('Option "' + prop + '" is DEPRECATED. Please, set "message.' + prop + '" instead.').yellow);
        defaultMessage[prop] = options[prop];
      }
    });


    if (this.filesSrc.length) {
      //When a file array is provided, use sources
      //as HTML/TXT message input
      //Multiple sources files will generate multiple messages
      messages = _.map(this.filesSrc, function (f) {
        var ext,
            txtFile,
            newMsg = false;

        if (grunt.file.isFile(f)) {

          ext = path.extname(f);

          if (ext === '.txt') {

            newMsg = _.clone(defaultMessage);
            newMsg.text = grunt.file.read(f);

          } else if (/^\.html?$/i.test(ext)) {

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

          }

        }

        return newMsg;

      });

    } else {
      messages.push(defaultMessage);
    }


    grunt.log.writeln(util.format('Sending %d e-mail%s to recipients: %s', messages.length, (messages.length > 1 ? 's': ''), defaultMessage.to.join(', ') ));

    //Sending messages in series (which is slower) since some
    //services may limit concurrent connections.
    async.eachSeries(messages, function (msg, next) {
      transport.sendMail(msg, function(error, responseStatus) {
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