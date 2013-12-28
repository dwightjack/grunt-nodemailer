'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.nodemailer = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },

  simple_message: function (test) {
    test.expect(4);

    var actual = grunt.file.readJSON('tmp/simple_message');

    test.ok(actual.message.indexOf('<h1>Test Message</h1>') !== -1, 'HTML parsed');
    test.ok(actual.message.indexOf('test fallback') !== -1, 'Text fallback parsed');
    test.ok(actual.message.indexOf('Content-Type: multipart/alternative;') !== -1, 'Multipart content-type set');

    test.equal(actual.envelope.to[0], 'john.doe@gmail.com', "Recipients processed");
    test.done();
  },

  mixed_recipients: function (test) {
    test.expect(2);

    var actual = grunt.file.readJSON('tmp/mixed_recipients');

    test.ok(actual.message.indexOf('To: myself@gmail.com, \"John Doe\" <john.doe@gmail.com>') !== -1, "Multiple recipients parsed");
    test.equal(actual.envelope.to.join(','), 'myself@gmail.com,john.doe@gmail.com', "Recipients processed into message envelope");
    test.done();
  },

  external_sources: function (test) {

    test.expect(5);


    var actual = grunt.file.readJSON('tmp/another_subject');
    var actualFallback = grunt.file.readJSON('tmp/test_with_fallback');

    test.ok(actual.message.indexOf('Subject: another_subject') !== -1, 'title tag in HTML source overrides default one');
    test.ok(actual.message.indexOf('<h2>Just a test</h2>') !== -1, 'Custom HTML from 1st source');
    test.ok(actual.message.indexOf('test fallback') !== -1, 'Text fallback is untouched');

    test.ok(actualFallback.message.indexOf('<h2>Test with fallback</h2>') !== -1, 'Custom HTML from 2nd source');
    test.ok(actualFallback.message.indexOf('this.is.the.text.fallback') !== -1, 'Text fallback automatically loaded');

    test.done();

  }


};
