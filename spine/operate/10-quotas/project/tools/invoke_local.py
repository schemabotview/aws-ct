"""Call place-order's handler the way Lambda does: import once, invoke many."""
import importlib
import json
import os
import sys

import boto3

os.environ.update(STOCK_TABLE="Stock", ORDERS_TABLE="Orders")
db = boto3.client("dynamodb")
for name, key in (("Stock", "product"), ("Orders", "order")):
    db.create_table(TableName=name, BillingMode="PAY_PER_REQUEST",
                    KeySchema=[{"AttributeName": key, "KeyType": "HASH"}],
                    AttributeDefinitions=[{"AttributeName": key,
                                           "AttributeType": "S"}])
db.put_item(TableName="Stock",
            Item={"product": {"S": "p-1002"}, "stock": {"N": "1"}})

sys.path.insert(0, "functions/place_order")
handler = importlib.import_module("handler")  # the cold start: init runs here
print("init: client and table names ready")
for order in ("o-601", "o-602"):
    body = {"id": order, "product": "p-1002", "qty": 1}
    reply = handler.handler({"body": json.dumps(body)}, context=None)
    print(order, reply["statusCode"], reply["body"])
