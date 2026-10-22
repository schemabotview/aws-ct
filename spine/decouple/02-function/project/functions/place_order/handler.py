"""place-order: take the stock and record the order, both or neither."""
import json
import os

import boto3

# Initialisation: runs once per execution environment, before the first call.
DB = boto3.client("dynamodb")
STOCK, ORDERS = os.environ["STOCK_TABLE"], os.environ["ORDERS_TABLE"]
calls = 0  # survives between invocations in the same environment


def handler(event, context):
    global calls
    calls += 1
    order = json.loads(event["body"])
    q = {":q": {"N": str(order["qty"])}}
    try:
        DB.transact_write_items(TransactItems=[
            {"Update": {"TableName": STOCK,
                        "Key": {"product": {"S": order["product"]}},
                        "UpdateExpression": "SET stock = stock - :q",
                        "ConditionExpression": "stock >= :q",
                        "ExpressionAttributeValues": q}},
            {"Put": {"TableName": ORDERS, "Item": {"order": {"S": order["id"]}},
                     "ConditionExpression": "attribute_not_exists(#o)",
                     "ExpressionAttributeNames": {"#o": "order"}}}])
        status = 201
    except DB.exceptions.TransactionCanceledException:
        status = 409
    return {"statusCode": status, "body": json.dumps({"call": calls})}
