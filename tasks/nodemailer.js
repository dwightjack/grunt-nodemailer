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

  var _ = grunt.util._;
  var util = require('util');
  var nodemailer = require('nodemailer');

  grunt.registerMultiTask('nodemailer', 'Grunt wrapper for Nodemailer', function() {
    var done = this.async(),
      src = [].concat(this.filesSrc),
      options = this.options({
        transport: null,
        recipients: [],
        from: 'nodemailer <sender@example.com>',
        subject: null
        html: '',
        text: ''
      }),
      srcHtml = options.html,
      srcTxt = options.text,
      transport,
      subject;

    if (_.isObject(options.transport)) {
      transport = nodemailer.createTransport(options.transport.type, options.transport);
    } else {
      transport = nodemailer.createTransport("sendmail");
    }

    //first file passed in will replace the HTML message body
    if (src.length) {
      srcHtml = grunt.file.read(src.shift());
    }
    //second file passed in will replace the plain text message body
    if (src.length) {
      srcTxt = grunt.file.read(src.shift());
    }


    var to = _.map(options.recipients, function(el) {
      var args = ['"%s" <%s>'];
      if (typeof el === 'string') {
        args.push(el, el);
      } else {
        args.push(el.name, el.email);
      }
      return util.format.apply(null, args);
    }).join(',');

    subject = [srcHtml.match(/<title>([^<]+)<\/title>/)].concat(options.subject);

    subject = _.chain(subject).flatten().compact().last().value();


    // Message object
    var message = {
      // sender info
      from: options.from,
      // Comma separated list of recipients
      to: to,
      // Subject of the message
      subject: subject, //
      // plaintext body
      text: srcTxt,
      // HTML body
      html: srcHtml
    };

    grunt.log.writeln('Sending emails to recipients: ' + to);

    transport.sendMail(message, function(error) {
      if (error) {
        grunt.fail.fatal('Error occured: ' + error.message);
        return;
      }
      grunt.log.writeln(('Message sent successfully!').green);
      done(true);
    });
  });

};