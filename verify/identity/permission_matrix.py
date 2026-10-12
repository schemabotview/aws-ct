"""Hidden verification for §2.4's permission matrix (scene `evaluation-flow`).

Applies the order API's policy — §2.3's three statements plus §2.4's DenyDrafts — to a principal in
moto's emulator with IAM enforcement on, makes each request on the board, and asserts the board's
decision. Emulator evidence: moto implements identity-policy Allow / explicit Deny / implicit deny; it
is not AWS. (moto enforces for IAM users; the policy, not the principal type, is what is under test.)
"""
import json

import boto3
from moto import mock_aws
from moto.core import set_initial_no_auth_action_count

ACCOUNT_BUCKET = "shop-catalog-111122223333"
POLICY = {
    "Version": "2012-10-17",
    "Statement": [
        {"Sid": "ReadProducts", "Effect": "Allow", "Action": "s3:GetObject",
         "Resource": f"arn:aws:s3:::{ACCOUNT_BUCKET}/products/*"},
        {"Sid": "ListProducts", "Effect": "Allow", "Action": "s3:ListBucket",
         "Resource": f"arn:aws:s3:::{ACCOUNT_BUCKET}",
         "Condition": {"StringLike": {"s3:prefix": "products/*"}}},
        {"Sid": "SendOrderEvents", "Effect": "Allow", "Action": "sqs:SendMessage",
         "Resource": "arn:aws:sqs:eu-west-2:*:order-events"},
        {"Sid": "DenyDrafts", "Effect": "Deny", "Action": "s3:GetObject",
         "Resource": f"arn:aws:s3:::{ACCOUNT_BUCKET}/products/drafts/*"},
    ],
}
KEYS = ["products/p-1001.json", "products/drafts/p-2000.json", "private/costs.csv"]


# Exactly the number of setup calls below (create_user, put_user_policy, create_access_key,
# create_bucket, 3 × put_object, create_queue). Any more and the first board requests would skip
# authorisation and pass for the wrong reason — which is how this file first "passed" a Deny row.
SETUP_CALLS = 8


@set_initial_no_auth_action_count(SETUP_CALLS)
@mock_aws
def main() -> None:
    region = "eu-west-2"
    iam = boto3.client("iam", region_name=region)
    iam.create_user(UserName="order-api")
    iam.put_user_policy(UserName="order-api", PolicyName="OrderApiAccess", PolicyDocument=json.dumps(POLICY))
    key = iam.create_access_key(UserName="order-api")["AccessKey"]

    admin_s3 = boto3.client("s3", region_name=region)
    admin_s3.create_bucket(Bucket=ACCOUNT_BUCKET, CreateBucketConfiguration={"LocationConstraint": region})
    for k in KEYS:
        admin_s3.put_object(Bucket=ACCOUNT_BUCKET, Key=k, Body=b"{}")
    queue = boto3.client("sqs", region_name=region).create_queue(QueueName="order-events")["QueueUrl"]

    # Sanity check that enforcement is ON for the board's principal: a call no statement allows.
    probe = boto3.client("s3", aws_access_key_id=key["AccessKeyId"], aws_secret_access_key=key["SecretAccessKey"], region_name=region)
    try:
        probe.delete_bucket(Bucket=ACCOUNT_BUCKET)
        raise AssertionError("IAM enforcement is not active — the setup-call count is wrong")
    except probe.exceptions.ClientError as e:
        assert e.response["Error"]["Code"] == "AccessDenied", e

    creds = dict(aws_access_key_id=key["AccessKeyId"], aws_secret_access_key=key["SecretAccessKey"], region_name=region)
    s3, sqs = boto3.client("s3", **creds), boto3.client("sqs", **creds)

    def outcome(call) -> str:
        try:
            call()
            return "Allow"
        except s3.exceptions.ClientError as e:
            assert e.response["Error"]["Code"] in ("AccessDenied", "AccessDeniedException"), e
            return "Deny"

    board = {
        "GetObject products/p-1001.json": ("Allow", lambda: s3.get_object(Bucket=ACCOUNT_BUCKET, Key=KEYS[0])),
        "GetObject products/drafts/p-2000.json": ("Deny", lambda: s3.get_object(Bucket=ACCOUNT_BUCKET, Key=KEYS[1])),
        "GetObject private/costs.csv": ("Deny", lambda: s3.get_object(Bucket=ACCOUNT_BUCKET, Key=KEYS[2])),
        "PutObject products/p-1001.json": ("Deny", lambda: s3.put_object(Bucket=ACCOUNT_BUCKET, Key=KEYS[0], Body=b"x")),
        "SendMessage order-events": ("Allow", lambda: sqs.send_message(QueueUrl=queue, MessageBody="{}")),
    }
    wrong = [f"{req}: board says {want}, moto says {got}"
             for req, (want, call) in board.items() if (got := outcome(call)) != want]
    assert not wrong, "\n".join(wrong)


main()
