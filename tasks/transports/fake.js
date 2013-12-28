'use strict';

var grunt = require('grunt');

/**
 * Fake transport. Instead of sending an email, writes it down to a file...
 */
function FileStubTransport(){}

FileStubTransport.prototype.sendMail = function(emailMessage, callback) {

    var output = "";

    // sendmail strips this header line by itself
    emailMessage.options.keepBcc = true;

    emailMessage.on("data", function(data){
        output += (data || '').toString('utf-8');
    });

    emailMessage.on("error", function(err){
        callback(err);
    });

    emailMessage.on("end", function(){
        var result = {message: output, envelope: emailMessage.getEnvelope(), messageId: emailMessage._messageId};

        grunt.file.write('tmp/' + emailMessage._message.subject, JSON.stringify(result));

        callback(null, result);
    });

    emailMessage.streamMessage();

};


module.exports = FileStubTransport;
