var AWS = require('aws-sdk'); 
var util = require('util');
var async = require('async');
var fs = require('fs');

// configure AWS
AWS.config.update({
  'region': 'us-east-1'
});

var sns = new AWS.SNS();
var sqs = new AWS.SQS();

var config = {};

function createTopic(cb) {
  sns.createTopic({
    'Name': 'demo'
  }, function (err, result) {

    if (err !== null) {
      console.log(util.inspect(err));
      return cb(err);
    }
    console.log(util.inspect(result));

    config.TopicArn = result.TopicArn;

    cb();
  });
}

function createQueue(cb) {
  sqs.createQueue({
    'QueueName': 'demo'
  }, function (err, result) {

    if (err !== null) {
      console.log(util.inspect(err));
      return cb(err);
    }

    console.log(util.inspect(result));

    config.QueueUrl = result.QueueUrl;

    cb();

  });

}


function getQueueAttr(cb) {
  sqs.getQueueAttributes({
    QueueUrl: config.QueueUrl,
  AttributeNames: ["QueueArn"]
  }, function (err, result) {

    if (err !== null) {
      console.log(util.inspect(err));
      return cb(err);
    }

    console.log(util.inspect(result));

    config.QueueArn = result.Attributes.QueueArn;

    cb();

  });

}


function snsSubscribe(cb) {
  sns.subscribe({
    'TopicArn': config.TopicArn,
  'Protocol': 'sqs',
  'Endpoint': config.QueueArn
  }, function (err, result) {

    if (err !== null) {
      console.log(util.inspect(err));
      return cb(err);
    }

    console.log(util.inspect(result));

    cb();
  });

}

function setQueueAttr(cb) {

  var queueUrl = config.QueueUrl;
  var topicArn = config.TopicArn;
  var sqsArn = config.QueueArn;

  var attributes = {
    "Version": "2008-10-17",
    "Id": sqsArn + "/SQSDefaultPolicy",
    "Statement": [{
      "Sid": "Sid" + new Date().getTime(),
      "Effect": "Allow",
      "Principal": {
        "AWS": "*"
      },
      "Action": "SQS:SendMessage",
      "Resource": sqsArn,
      "Condition": {
        "ArnEquals": {
          "aws:SourceArn": topicArn
        }
      }
    }
    ]
  };

  sqs.setQueueAttributes({
    QueueUrl: queueUrl,
    Attributes: {
      'Policy': JSON.stringify(attributes)
    }
  }, function (err, result) {

    if (err !== null) {
      console.log(util.inspect(err));
      return cb(err);
    }

    console.log(util.inspect(result));

    cb();
  });

}

function writeConfigFile(cb) {
  fs.writeFile('config.json', JSON.stringify(config, null, 4), function(err) {
    if(err) {
      return cb(err);
    }

    console.log("config saved to config.json");
    cb();
  }); 

}

async.series([createTopic, createQueue, getQueueAttr, snsSubscribe, setQueueAttr, writeConfigFile]);

