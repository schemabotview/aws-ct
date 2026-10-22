"""Let one AWS service send to a queue, only on behalf of one source ARN."""
import json
import sys

import boto3

url, service, source = sys.argv[1:4]
sqs = boto3.client("sqs")
queue = sqs.get_queue_attributes(QueueUrl=url, AttributeNames=["QueueArn"])
policy = {"Version": "2012-10-17", "Statement": [{
    "Effect": "Allow", "Principal": {"Service": service},
    "Action": "sqs:SendMessage", "Resource": queue["Attributes"]["QueueArn"],
    "Condition": {"ArnEquals": {"aws:SourceArn": source}}}]}
sqs.set_queue_attributes(QueueUrl=url,
                         Attributes={"Policy": json.dumps(policy)})
