import type { Scene } from '@graphlearning/flow'

// §7.4 — the queue-consumer sequence, emulated in moto with a 1 s visibility timeout so it runs
// quickly: worker A receives and crashes; the message is invisible, then reappears; worker B receives
// it again (receive #2) and deletes it — acknowledgement is the delete. Defaults on real SQS:
// visibility 30 s (max 12 h), retention 4 days (max 14). FIFO deduplicates sends only within 5 min.
// source: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html
// source: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/FIFO-queues-exactly-once-processing.html
export const queueConsumer: Scene = {
  id: 'queue-consumer',
  title: 'Received is not done; deleted is done',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'consumer',
      kind: 'code',
      filename: 'consumer.py · emulated',
      hug: true,
      label: `import time

import boto3
from moto import mock_aws

with mock_aws():
    sqs = boto3.client("sqs", region_name="eu-west-2")
    q = sqs.create_queue(QueueName="fulfilment", Attributes={
        "VisibilityTimeout": "1"})["QueueUrl"]
    sqs.send_message(QueueUrl=q, MessageBody='{"order": "o-501"}')

    def receive(worker):
        r = sqs.receive_message(QueueUrl=q, AttributeNames=[
            "ApproximateReceiveCount"])
        for m in r.get("Messages", []):
            n = m["Attributes"]["ApproximateReceiveCount"]
            print(f"{worker}: got {m['Body']} (receive #{n})")
            return m
        print(f"{worker}: nothing visible")

    receive("worker A")  # ...and crashes before deleting it
    receive("worker B")  # hidden while A holds it
    time.sleep(1.2)      # the visibility timeout runs out
    m = receive("worker B")
    sqs.delete_message(QueueUrl=q, ReceiptHandle=m["ReceiptHandle"])
    left = sqs.get_queue_attributes(QueueUrl=q, AttributeNames=[
        "ApproximateNumberOfMessages"])["Attributes"]
    print("B deleted it; waiting:", left["ApproximateNumberOfMessages"])`,
    },
    {
      id: 'consumer-out',
      kind: 'code',
      filename: 'output',
      hug: true,
      label: `worker A: got {"order": "o-501"} (receive #1)
worker B: nothing visible
worker B: got {"order": "o-501"} (receive #2)
B deleted it; waiting: 0`,
    },
    {
      id: 'standard-fifo',
      kind: 'table',
      label: 'Standard or FIFO?',
      sub: 'both need idempotent consumers',
      headers: ['', 'standard', 'FIFO'],
      values: [
        ['delivery', 'at least once', 'once per send, 5-min dedup'],
        ['order', 'best effort', 'per message group'],
        ['throughput', 'nearly unlimited', 'limited per group'],
        ['shop use', 'fulfilment', 'per-customer events'],
      ],
    },
  ],
  edges: [],
}
