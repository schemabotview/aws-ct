"""Two jobs update one product file at once. Without a condition, the last
writer wins; with If-Match, the slower one is refused, re-reads and retries."""
import json

import boto3
from botocore.exceptions import ClientError

s3 = boto3.client("s3")
BUCKET, KEY = "shop-catalog-111122223333", "products/p-1001.json"


def read():
    obj = s3.get_object(Bucket=BUCKET, Key=KEY)
    return json.loads(obj["Body"].read()), obj["ETag"]


def write(doc, etag=None):
    condition = {"IfMatch": etag} if etag else {}
    s3.put_object(Bucket=BUCKET, Key=KEY, Body=json.dumps(doc), **condition)


def race(conditional):
    write({"price": 12.0, "stock": 40})
    (price, price_tag), (stock, stock_tag) = read(), read()  # both read first
    price["price"] = 10.0  # the price job: 12.00 becomes 10.00
    write(price, price_tag if conditional else None)
    stock["stock"] -= 1  # the stock job: one sold
    try:
        write(stock, stock_tag if conditional else None)
    except ClientError as e:
        print("  stock job:", e.response["Error"]["Code"], "- re-read, retry")
        stock, tag = read()
        stock["stock"] -= 1
        write(stock, tag)
    return read()[0]


print("plain PUT ends", race(conditional=False))
print("If-Match ends ", race(conditional=True))
