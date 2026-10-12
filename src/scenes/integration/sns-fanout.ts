import type { Scene } from '@graphlearning/flow'

// §7.5 — one order event, many subscribers: an SNS topic fans out to three SQS queues; the fraud
// queue's filter policy (numeric total >= 500) receives only o-502. Emulated in moto. Each queue
// buffers for its own consumer, so a slow subscriber does not slow the others.
// source: https://docs.aws.amazon.com/sns/latest/dg/sns-message-filtering.html
export const snsFanout: Scene = {
  id: 'sns-fanout',
  title: 'Publish once, deliver to each subscriber',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'shape',
      label: 'order-events topic',
      pattern: 'group',
      cols: 3,
      children: [
        { id: 'q-fulfil', label: 'fulfilment', sub: 'every order', pattern: 'service', icon: 'sqs' },
        { id: 'q-loyalty', label: 'loyalty', sub: 'every order', pattern: 'service', icon: 'sqs' },
        { id: 'q-fraud', label: 'fraud-check', sub: 'total ≥ 500 only', pattern: 'warn', icon: 'sqs' },
      ],
    },
    {
      id: 'fanout',
      kind: 'code',
      filename: 'fan_out.py · emulated',
      hug: true,
      label: `import json

import boto3
from moto import mock_aws

with mock_aws():
    sns = boto3.client("sns", region_name="eu-west-2")
    sqs = boto3.client("sqs", region_name="eu-west-2")
    topic = sns.create_topic(Name="order-events")["TopicArn"]
    subscribers = {
        "fulfilment": None,  # every order
        "loyalty": None,     # every order
        "fraud-check": {"total": [{"numeric": [">=", 500]}]},
    }
    queues = {}
    for name, policy in subscribers.items():
        url = sqs.create_queue(QueueName=name)["QueueUrl"]
        arn = sqs.get_queue_attributes(QueueUrl=url, AttributeNames=[
            "QueueArn"])["Attributes"]["QueueArn"]
        attrs = {"RawMessageDelivery": "true"}
        if policy:
            attrs["FilterPolicy"] = json.dumps(policy)
        sns.subscribe(TopicArn=topic, Protocol="sqs", Endpoint=arn,
                      Attributes=attrs)
        queues[name] = url

    for order, total in [("o-501", 29), ("o-502", 640), ("o-503", 75)]:
        sns.publish(TopicArn=topic, Message=json.dumps({"order": order}),
                    MessageAttributes={"total": {
                        "DataType": "Number", "StringValue": str(total)}})

    for name, url in queues.items():
        got = sqs.receive_message(QueueUrl=url, MaxNumberOfMessages=10)
        orders = [json.loads(m["Body"])["order"]
                  for m in got.get("Messages", [])]
        print(f"{name:<12}", sorted(orders))`,
    },
    {
      id: 'fanout-out',
      kind: 'code',
      filename: 'output',
      hug: true,
      label: `fulfilment   ['o-501', 'o-502', 'o-503']
loyalty      ['o-501', 'o-502', 'o-503']
fraud-check  ['o-502']`,
    },
  ],
  edges: [],
}
