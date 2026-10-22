"""Doing it once: a duplicate delivery, a poison message and a dead letter."""
import random

import boto3

db, sqs = boto3.client("dynamodb"), boto3.client("sqs")
db.create_table(TableName="idempotency", BillingMode="PAY_PER_REQUEST",
                KeySchema=[{"AttributeName": "key", "KeyType": "HASH"}],
                AttributeDefinitions=[{"AttributeName": "key",
                                       "AttributeType": "S"}])


def ship(order: str) -> str:
    """Claim the key first; only the first delivery gets to ship."""
    try:
        db.put_item(TableName="idempotency",
                    Item={"key": {"S": f"ship#{order}"}},
                    ConditionExpression="attribute_not_exists(#k)",
                    ExpressionAttributeNames={"#k": "key"})
    except db.exceptions.ConditionalCheckFailedException:
        return "already shipped, skipped"
    return "shipped"


for n in (1, 2):                      # a standard queue delivers at least once
    print(f"o-501 delivery {n}: {ship('o-501')}")

dlq = sqs.create_queue(QueueName="fulfilment-dlq")["QueueUrl"]
dlq_arn = sqs.get_queue_attributes(QueueUrl=dlq, AttributeNames=["QueueArn"])
redrive = ('{"deadLetterTargetArn": "%s", "maxReceiveCount": "3"}'
           % dlq_arn["Attributes"]["QueueArn"])
url = sqs.create_queue(QueueName="fulfilment", Attributes={
    "VisibilityTimeout": "0", "RedrivePolicy": redrive})["QueueUrl"]
sqs.send_message(QueueUrl=url, MessageBody="o-999")   # an address that fails
for attempt in range(1, 5):
    got = sqs.receive_message(QueueUrl=url).get("Messages", [])
    print(f"attempt {attempt}:", "o-999 fails, not deleted" if got else "empty")
moved = sqs.receive_message(QueueUrl=dlq).get("Messages", [])
print("fulfilment-dlq:", [m["Body"] for m in moved])

random.seed(91)                       # backoff that doubles, with full jitter
print("retry waits:", [round(random.uniform(0, 0.2 * 2 ** n), 2)
                       for n in range(4)])
