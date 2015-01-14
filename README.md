# SNS/SQS Example

This is an example of how to use AWS SNS and SQS to publish messages to a topic(SNS) and consume them from a queue(SQS) using NodeJS and the aws-sdk.

## Prep
Log into your AWS console and create a new user in IAM. Make sure you save the users credientials. 
Attach the User Policies for Amazon SQS Full Access and Amazon SNS Full Access.  

Create ~/.aws/credentials

Add the access key and secret access key for the IAM user you just created.
```
[snssqs]
aws_access_key_id = <YOUR_ACCESS_KEY_ID>
aws_secret_access_key = <YOUR_SECRET_ACCESS_KEY>
```

## Install Packages

npm install

## Create Topic and Queue

AWS_PROFILE=snssqs node create.js 

## Run

### Publish
AWS_PROFILE=snssqs node publish.js 

### Consume
AWS_PROFILE=snssqs node consume.js 

