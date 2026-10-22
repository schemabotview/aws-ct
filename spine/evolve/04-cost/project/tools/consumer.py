"""The fulfilment worker: receive, work, delete -- and a crash in between."""
import boto3

sqs = boto3.client("sqs")
url = sqs.create_queue(QueueName="fulfilment",
                       Attributes={"VisibilityTimeout": "30"})["QueueUrl"]
for order in ("o-501", "o-502", "o-503"):
    sqs.send_message(QueueUrl=url, MessageBody=order)


def receive(wait: int = 0) -> list[dict]:
    return sqs.receive_message(QueueUrl=url, MaxNumberOfMessages=10,
                               WaitTimeSeconds=wait,
                               AttributeNames=["ApproximateReceiveCount"]
                               ).get("Messages", [])


for m in receive(wait=20):                 # long polling: waits for work
    if m["Body"] == "o-503":
        print("o-503 received, worker crashes before deleting it")
        crashed = m["ReceiptHandle"]
        continue
    sqs.delete_message(QueueUrl=url, ReceiptHandle=m["ReceiptHandle"])
    print(m["Body"], "shipped, deleted")

print("receive now:", [m["Body"] for m in receive()], "- o-503 is invisible")
# Rather than wait 30 s, end the visibility timeout by hand.
sqs.change_message_visibility(QueueUrl=url, ReceiptHandle=crashed,
                              VisibilityTimeout=0)
for m in receive():
    count = m["Attributes"]["ApproximateReceiveCount"]
    sqs.delete_message(QueueUrl=url, ReceiptHandle=m["ReceiptHandle"])
    print(m["Body"], f"back after the timeout, receive #{count}, deleted")
