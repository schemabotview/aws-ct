import type { Scene } from '@graphlearning/flow'

// §7.6 — EventBridge routes by content: rule uk-vat matches OrderPlaced events from shop.orders with
// country GB; rule refunds matches OrderRefunded. Emulated in moto: o-504 (FR) matches no rule and is
// dropped by design. The shape of `detail` is the contract consumers depend on (a schema).
// source: https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-patterns.html
export const eventRouting: Scene = {
  id: 'event-routing',
  title: 'Rules route events by their content',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'routing',
      kind: 'code',
      filename: 'routing.py · emulated',
      hug: true,
      label: `import json

import boto3
from moto import mock_aws

with mock_aws():
    ev = boto3.client("events", region_name="eu-west-2")
    sqs = boto3.client("sqs", region_name="eu-west-2")
    rules = {
        "uk-vat": {"source": ["shop.orders"],
                   "detail-type": ["OrderPlaced"],
                   "detail": {"country": ["GB"]}},
        "refunds": {"source": ["shop.orders"],
                    "detail-type": ["OrderRefunded"]},
    }
    targets = {}
    for rule, pattern in rules.items():
        ev.put_rule(Name=rule, EventPattern=json.dumps(pattern))
        url = sqs.create_queue(QueueName=rule)["QueueUrl"]
        arn = sqs.get_queue_attributes(QueueUrl=url, AttributeNames=[
            "QueueArn"])["Attributes"]["QueueArn"]
        ev.put_targets(Rule=rule, Targets=[{"Id": rule, "Arn": arn}])
        targets[rule] = url

    ev.put_events(Entries=[
        {"Source": "shop.orders", "DetailType": kind,
         "Detail": json.dumps({"order": o, "country": c})}
        for o, kind, c in [("o-501", "OrderPlaced", "GB"),
                           ("o-504", "OrderPlaced", "FR"),
                           ("o-502", "OrderRefunded", "GB")]])

    for rule, url in targets.items():
        got = sqs.receive_message(QueueUrl=url, MaxNumberOfMessages=10)
        print(f"{rule:<8}", [json.loads(m["Body"])["detail"]["order"]
                             for m in got.get("Messages", [])])`,
    },
    {
      id: 'routing-out',
      kind: 'code',
      filename: 'output',
      hug: true,
      label: `uk-vat   ['o-501']
refunds  ['o-502']`,
    },
  ],
  edges: [],
}
