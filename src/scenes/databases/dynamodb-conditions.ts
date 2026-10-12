import type { Scene } from '@graphlearning/flow'

// §6.6 — the last unit of p-1002, taken by a transaction that writes the order AND decrements stock
// with a condition (stock >= 1). The second order is cancelled with ConditionalCheckFailed and leaves
// no order behind. Run in moto (emulated). Reads: ConsistentRead=True is available on the table, not
// on a GSI (index reads are eventually consistent); global tables add MREC (last writer wins across
// Regions) or MRSC variants.
// source: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/transaction-apis.html
// source: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html
// source: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/V2globaltables_HowItWorks.html
export const dynamodbConditions: Scene = {
  id: 'dynamodb-conditions',
  title: 'A condition guards the last unit',
  cols: 2,
  padding: 0.12,
  nodes: [
    {
      id: 'stock',
      kind: 'code',
      filename: 'last_unit.py · emulated',
      hug: true,
      label: `import boto3
from moto import mock_aws

with mock_aws():
    ddb = boto3.client("dynamodb", region_name="eu-west-2")
    for name, key in (("Stock", "product"), ("Orders", "order")):
        ddb.create_table(
            TableName=name, BillingMode="PAY_PER_REQUEST",
            KeySchema=[{"AttributeName": key, "KeyType": "HASH"}],
            AttributeDefinitions=[{"AttributeName": key,
                                   "AttributeType": "S"}])
    ddb.put_item(TableName="Stock", Item={
        "product": {"S": "p-1002"}, "stock": {"N": "1"}})

    def place(order):  # write the order AND take stock, or neither
        try:
            ddb.transact_write_items(TransactItems=[
                {"Put": {"TableName": "Orders", "Item": {
                    "order": {"S": order}, "product": {"S": "p-1002"}}}},
                {"Update": {
                    "TableName": "Stock",
                    "Key": {"product": {"S": "p-1002"}},
                    "UpdateExpression": "SET stock = stock - :one",
                    "ConditionExpression": "stock >= :one",
                    "ExpressionAttributeValues": {":one": {"N": "1"}}}},
            ])
            print(order, "placed")
        except ddb.exceptions.TransactionCanceledException as e:
            reason = e.response["CancellationReasons"][1]["Code"]
            print(order, "cancelled:", reason)

    place("o-601")
    place("o-602")  # the last unit has gone
    left = ddb.get_item(TableName="Stock", ConsistentRead=True,
                        Key={"product": {"S": "p-1002"}})
    print("stock now", left["Item"]["stock"]["N"],
          "| orders:", ddb.scan(TableName="Orders")["Count"])`,
    },
    {
      id: 'stock-out',
      kind: 'code',
      filename: 'output',
      hug: true,
      label: `o-601 placed
o-602 cancelled: ConditionalCheckFailed
stock now 0 | orders: 1`,
    },
    {
      id: 'reads',
      kind: 'table',
      label: 'Read consistency, by variant',
      sub: 'say which before promising',
      headers: ['read from', 'strongly consistent?'],
      values: [
        ['table, ConsistentRead', 'yes'],
        ['table, default read', 'no, eventually'],
        ['global secondary index', 'no, eventually'],
        ['global table, MREC', 'own Region only'],
        ['global table, MRSC', 'yes, across Regions'],
      ],
    },
  ],
  edges: [],
}
