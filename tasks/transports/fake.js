'use strict';

var grunt = require('grunt');

/**
 * Fake transport. Instead of sending an email, writes it down to a file...
 */
module.exports = {
    name: 'filestub',
    version: '0.1.0',
    send: function (mail, callback) {
        var input = mail.message.createReadStream(),
            output = '';

        input.on('data', function(data){
            output += (data || '').toString('utf-8');
        });

        input.on('error', function(err){
            callback(err);
        });

        input.on('end', function () {
            var messageId = (mail.message.getHeader('message-id') || '').replace(/[<>\s]/g, '');
            var result = {message: output, envelope: mail.message.getEnvelope(), messageId: messageId};
            grunt.file.write('tmp/' + mail.message.getHeader('subject'), JSON.stringify(result));
            callback(null, result);
        });
    }
};
//
//FileStubTransport.prototype.sendMail = function(emailMessage, callback) {
//
//    var output = "";
//
//    // sendmail strips this header line by itself
//    emailMessage.options.keepBcc = true;
//
//    emailMessage.on("data", function(data){
//        output += (data || '').toString('utf-8');
//    });
//
//    emailMessage.on("error", function(err){
//        callback(err);
//    });
//
//    emailMessage.on("end", function(){
//        var result = {message: output, envelope: emailMessage.getEnvelope(), messageId: emailMessage._messageId};
//
//
//
//        callback(null, result);
//    });
//
//    emailMessage.streamMessage();
//
//};
//
//
//module.exports = FileStubTransport;
