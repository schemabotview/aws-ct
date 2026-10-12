import type { Scene } from '@graphlearning/flow'

// §6.5 — DynamoDB keys for "a customer's orders, newest first": partition key customer, sort key
// "<timestamp>#<order>", plus a GSI on status. Run in moto (emulated). The status index has only two
// key values, so nearly all items share one partition key — a hot partition in waiting. Variant: a
// single-Region table with on-demand capacity.
// source: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-partition-key-design.html
// source: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.html
export const dynamodbKeys: Scene = {
  id: 'dynamodb-keys',
  title: 'Keys are your queries',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'keys',
      kind: 'code',
      filename: 'orders_table.py · emulated',
      hug: true,
      label: `from collections import Counter

import boto3
from boto3.dynamodb.conditions import Key
from moto import mock_aws

with mock_aws():
    db = boto3.resource("dynamodb", region_name="eu-west-2")
    t = db.create_table(
        TableName="Orders", BillingMode="PAY_PER_REQUEST",
        KeySchema=[{"AttributeName": "customer", "KeyType": "HASH"},
                   {"AttributeName": "order", "KeyType": "RANGE"}],
        AttributeDefinitions=[
            {"AttributeName": a, "AttributeType": "S"}
            for a in ("customer", "order", "status")],
        GlobalSecondaryIndexes=[{
            "IndexName": "by-status",
            "KeySchema": [{"AttributeName": "status", "KeyType": "HASH"},
                          {"AttributeName": "order", "KeyType": "RANGE"}],
            "Projection": {"ProjectionType": "ALL"}}])
    for n in range(500, 520):
        t.put_item(Item={
            "customer": f"c-{70 + n % 8}",
            "order": f"2026-10-12T18:{n - 500:02d}#{n}",
            "status": "PENDING" if n % 10 == 0 else "PAID"})

    newest = t.query(KeyConditionExpression=Key("customer").eq("c-77"),
                     ScanIndexForward=False, Limit=2)["Items"]
    print("c-77 newest:", [i["order"] for i in newest])
    pending = t.query(IndexName="by-status",
                      KeyConditionExpression=Key("status").eq("PENDING"))
    print("PENDING via index:", pending["Count"])
    spread = Counter(i["status"] for i in t.scan()["Items"])
    print("items per status key:", dict(spread))`,
    },
    {
      id: 'keys-out',
      kind: 'code',
      filename: 'output',
      hug: true,
      label: `c-77 newest: ['2026-10-12T18:19#519', '2026-10-12T18:11#511']
PENDING via index: 2
items per status key: {'PAID': 18, 'PENDING': 2}`,
    },
  ],
  edges: [],
}
