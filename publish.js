var AWS = require('aws-sdk'); 
var util = require('util');
var config = require('./config.json');

// configure AWS
AWS.config.update({
  'region': 'us-east-1'
});

var sns = new AWS.SNS();

function publish(mesg) {
  var publishParams = { 
    TopicArn : config.TopicArn,
    Message: mesg
  };

  sns.publish(publishParams, function(err, data) {
    process.stdout.write(".");
    //console.log(data);
  });
}

for (var i=0; i < 500; i++) {
  publish("message: " + i);
}
