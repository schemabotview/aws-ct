import type { Scene } from '@graphlearning/flow'

// §7.8 — business-effect idempotency, emulated with a DynamoDB conditional put: a fulfilment message
// delivered twice ships one parcel; a POST /orders whose reply was lost, retried with the same
// Idempotency-Key, returns the SAME order o-501. FIFO deduplication would not cover either: it only
// suppresses repeated SENDS within 5 minutes. Lambda retry ownership differs by invocation type.
// source: https://docs.aws.amazon.com/lambda/latest/dg/invocation-retries.html
// source: https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/
export const idempotency: Scene = {
  id: 'idempotency',
  title: 'Make the second time harmless',
  cols: 2,
  padding: 0.05,
  nodes: [
    {
      id: 'run',
      label: 'Two duplicates, one effect each',
      pattern: 'group',
      cols: 1,
      children: [
        {
          id: 'idem',
          kind: 'code',
          filename: 'idempotent.py · emulated',
          hug: true,
          label: `import boto3
from moto import mock_aws

with mock_aws():
    ddb = boto3.client("dynamodb", region_name="eu-west-2")
    ddb.create_table(
        TableName="idempotency", BillingMode="PAY_PER_REQUEST",
        KeySchema=[{"AttributeName": "id", "KeyType": "HASH"}],
        AttributeDefinitions=[{"AttributeName": "id",
                               "AttributeType": "S"}])

    def claim(key, result):  # store once; on a repeat, return the first
        try:
            ddb.put_item(TableName="idempotency", Item={
                "id": {"S": key}, "result": {"S": result}},
                ConditionExpression="attribute_not_exists(id)")
            return None
        except ddb.exceptions.ConditionalCheckFailedException:
            old = ddb.get_item(TableName="idempotency", ConsistentRead=True,
                               Key={"id": {"S": key}})
            return old["Item"]["result"]["S"]

    # 1. a fulfilment message delivered twice (at-least-once)
    parcels = []
    for delivery in (1, 2):
        if claim("ship#o-501", "shipped") is None:
            parcels.append("o-501")
        print(f"delivery {delivery}: parcels = {parcels}")

    # 2. POST /orders commits, the reply is lost, the client retries
    next_id = 501
    for attempt in ("first try (reply lost)", "retry, same key"):
        earlier = claim("key#k-91", f"o-{next_id}")
        order = earlier or f"o-{next_id}"
        next_id += earlier is None
        print(f"{attempt:<22} -> {order}")`,
        },
        {
          id: 'idem-out',
          kind: 'code',
          filename: 'output',
          hug: true,
          label: `delivery 1: parcels = ['o-501']
delivery 2: parcels = ['o-501']
first try (reply lost) -> o-501
retry, same key        -> o-501`,
        },
      ],
    },
    {
      id: 'retry-owners',
      kind: 'table',
      label: 'Who retries a failed Lambda?',
      sub: 'standard on-demand function',
      headers: ['invoked', 'retried by', 'then'],
      values: [
        ['synchronously (API)', 'the caller', 'caller decides'],
        ['asynchronously (event)', 'Lambda, 2 more times', 'DLQ / on-failure dest.'],
        ['by SQS mapping', 'the queue, on reappear', 'DLQ after maxReceiveCount'],
      ],
    },
  ],
  edges: [],
}
