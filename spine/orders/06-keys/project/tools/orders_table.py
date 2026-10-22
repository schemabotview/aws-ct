"""The Orders table: one customer's orders by key, and an index on status."""
from collections import Counter

import boto3
from boto3.dynamodb.conditions import Key

db = boto3.resource("dynamodb")
table = db.create_table(
    TableName="Orders", BillingMode="PAY_PER_REQUEST",
    KeySchema=[{"AttributeName": "customer", "KeyType": "HASH"},
               {"AttributeName": "sk", "KeyType": "RANGE"}],
    AttributeDefinitions=[{"AttributeName": n, "AttributeType": "S"}
                          for n in ("customer", "sk", "status")],
    GlobalSecondaryIndexes=[{
        "IndexName": "by-status", "Projection": {"ProjectionType": "ALL"},
        "KeySchema": [{"AttributeName": "status", "KeyType": "HASH"}]}])

ORDERS = [("c-17", "2026-10-10T18:02", "o-501", "shipped"),
          ("c-17", "2026-10-12T18:40", "o-511", "placed"),
          ("c-17", "2026-10-12T19:05", "o-514", "placed"),
          ("c-22", "2026-10-11T12:30", "o-507", "shipped"),
          ("c-22", "2026-10-12T20:10", "o-516", "placed"),
          ("c-31", "2026-10-12T21:45", "o-519", "placed")]
for customer, at, order, status in ORDERS:
    table.put_item(Item={"customer": customer, "sk": f"{at}#{order}",
                         "order": order, "status": status})

# A customer's orders, newest first: one partition, read in sort-key order.
mine = table.query(KeyConditionExpression=Key("customer").eq("c-17"),
                   ScanIndexForward=False)["Items"]
print("c-17, newest first:", [i["order"] for i in mine])

# Last week's orders: a range of the sort key, still one partition.
week = table.query(KeyConditionExpression=Key("customer").eq("c-17")
                   & Key("sk").between("2026-10-11", "2026-10-13"))["Items"]
print("c-17, 11-12 Oct:   ", [i["order"] for i in week])

# The index answers "every placed order" -- but status has two values.
placed = table.query(IndexName="by-status",
                     KeyConditionExpression=Key("status").eq("placed"))["Items"]
print("by-status placed:  ", sorted(i["order"] for i in placed))
spread = Counter(i["status"] for i in table.scan()["Items"])
print("index keys:", dict(spread), "- every write lands on one of 2")
