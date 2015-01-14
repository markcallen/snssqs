var AWS = require('aws-sdk'); 
var util = require('util');
var config = require('./config.json');

// configure AWS
AWS.config.update({
  'region': 'us-east-1'
});

var sqs = new AWS.SQS();

var receiveMessageParams = {
  QueueUrl: config.QueueUrl,
  MaxNumberOfMessages: 10
};

function getMessages() {
  sqs.receiveMessage(receiveMessageParams, receiveMessageCallback);
}

function receiveMessageCallback(err, data) {
  //console.log(data);

  if (data && data.Messages && data.Messages.length > 0) {

    for (var i=0; i < data.Messages.length; i++) {
      process.stdout.write(".");
      //console.log("do something with the message here...");
      //
      // Delete the message when we've successfully processed it
      var deleteMessageParams = {
        QueueUrl: config.QueueUrl,
        ReceiptHandle: data.Messages[i].ReceiptHandle
      };

      sqs.deleteMessage(deleteMessageParams, deleteMessageCallback);
    }

    getMessages();

  } else {
    process.stdout.write("-");
    setTimeout(getMessages(), 100);
  }
}

function deleteMessageCallback(err, data) {
  //console.log("deleted message");
  //console.log(data);
}

setTimeout(getMessages(), 100);


