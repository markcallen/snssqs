SNS/SQS Example

Prep
----
Create a new user in IAM.  Grant them roles to read/write to SNS and SQS


Create ~/.aws/credentials

Add the access key and secret access key for the IAM user you just created.
[snssqs]
aws_access_key_id = <YOUR_ACCESS_KEY_ID>
aws_secret_access_key = <YOUR_SECRET_ACCESS_KEY>


Run
---

AWS_PROFILE=snssqs node consume.js 

