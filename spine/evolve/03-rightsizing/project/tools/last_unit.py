"""The last p-1002: two orders race for it, and a transaction lets one win."""
import boto3

client = boto3.client("dynamodb")
for name, key in (("Stock", "product"), ("Orders", "order")):
    client.create_table(
        TableName=name, BillingMode="PAY_PER_REQUEST",
        KeySchema=[{"AttributeName": key, "KeyType": "HASH"}],
        AttributeDefinitions=[{"AttributeName": key, "AttributeType": "S"}])
client.put_item(TableName="Stock",
                Item={"product": {"S": "p-1002"}, "stock": {"N": "1"}})


def place(order: str, qty: int) -> None:
    """Take the stock AND record the order -- both, or neither."""
    try:
        client.transact_write_items(TransactItems=[
            {"Update": {
                "TableName": "Stock", "Key": {"product": {"S": "p-1002"}},
                "UpdateExpression": "SET stock = stock - :q",
                "ConditionExpression": "stock >= :q",
                "ExpressionAttributeValues": {":q": {"N": str(qty)}}}},
            {"Put": {
                "TableName": "Orders",
                "Item": {"order": {"S": order}, "product": {"S": "p-1002"}},
                "ConditionExpression": "attribute_not_exists(#o)",
                "ExpressionAttributeNames": {"#o": "order"}}}])
        print(f"{order}: placed")
    except client.exceptions.TransactionCanceledException as e:
        codes = [r["Code"] for r in e.response["CancellationReasons"]]
        print(f"{order}: cancelled {codes}")


place("o-601", 1)
place("o-602", 1)
stock = client.get_item(TableName="Stock", Key={"product": {"S": "p-1002"}},
                        ConsistentRead=True)["Item"]["stock"]["N"]
orders = client.scan(TableName="Orders")["Count"]
print(f"stock {stock}, orders {orders}")
