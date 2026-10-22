"""Read everything waiting in each named queue; print the order ids."""
import json
import sys

import boto3

sqs = boto3.client("sqs")
for name in sys.argv[1:]:
    url = sqs.get_queue_url(QueueName=name)["QueueUrl"]
    got = sqs.receive_message(QueueUrl=url, MaxNumberOfMessages=10)
    bodies = [m["Body"] for m in got.get("Messages", [])]
    # An EventBridge target gets the whole event; the order is in its detail.
    ids = [json.loads(b)["detail"]["order"] if b.startswith("{") else b
           for b in bodies]
    print(f"{name + ':':<12}", " ".join(ids) or "-")
