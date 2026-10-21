"""Try the app's requests as OrderApi, and print what was decided."""
import boto3
from botocore.exceptions import ClientError

session = boto3.Session(profile_name="order-api")
s3, sqs = session.client("s3"), session.client("sqs")
BUCKET = "shop-catalog-111122223333"
QUEUE = "https://sqs.eu-west-2.amazonaws.com/111122223333/order-events"

TRIES = {
    "read products/p-1001.json": lambda: s3.get_object(
        Bucket=BUCKET, Key="products/p-1001.json"),
    "read products/drafts/p-2001.json": lambda: s3.get_object(
        Bucket=BUCKET, Key="products/drafts/p-2001.json"),
    "read orders/o-501.json": lambda: s3.get_object(
        Bucket=BUCKET, Key="orders/o-501.json"),
    "overwrite products/p-1001.json": lambda: s3.put_object(
        Bucket=BUCKET, Key="products/p-1001.json", Body=b"{}"),
    "send to order-events": lambda: sqs.send_message(
        QueueUrl=QUEUE, MessageBody='{"order": "o-501"}'),
}

print(session.client("sts").get_caller_identity()["Arn"])
for request, call in TRIES.items():
    try:
        call()
        print(f"{request:36} allowed")
    except ClientError as e:
        print(f"{request:36} {e.response['Error']['Code']}")
