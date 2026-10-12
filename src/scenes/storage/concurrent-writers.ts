import type { Scene } from '@graphlearning/flow'

// §5.3 — two jobs read p-1001.json, change different fields and write it back. S3 is strongly
// consistent for every read after a write, but concurrent PUTs to one key are last-writer-wins: the
// price change is silently lost. A conditional write (If-Match on the ETag read) turns the second
// write into 412 PreconditionFailed, so the stock job re-reads and re-applies. Run in moto, so the
// behaviour is emulated. Strong consistency is per object: there is no multi-object transaction.
// source: https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel
// source: https://docs.aws.amazon.com/AmazonS3/latest/userguide/conditional-writes.html
export const concurrentWriters: Scene = {
  id: 'concurrent-writers',
  title: 'Two writers, one key',
  flow: 'TB',
  padding: 0.05,
  nodes: [
    {
      id: 'race',
      kind: 'code',
      filename: 'two_writers.py · emulated',
      hug: true,
      label: `import json

import boto3
from moto import mock_aws

B, K = "shop-catalog-111122223333", "products/p-1001.json"
START = json.dumps({"price": 12.0, "stock": 40})
with mock_aws():
    s3 = boto3.client("s3", region_name="eu-west-2")
    s3.create_bucket(Bucket=B, CreateBucketConfiguration={
        "LocationConstraint": "eu-west-2"})

    def read():
        r = s3.get_object(Bucket=B, Key=K)
        return json.loads(r["Body"].read()), r["ETag"]

    def put(doc, **cond):
        s3.put_object(Bucket=B, Key=K, Body=json.dumps(doc), **cond)

    for mode in ("plain PUT", "If-Match PUT"):
        s3.put_object(Bucket=B, Key=K, Body=START)
        a, tag_a = read()  # pricing job reads
        b, tag_b = read()  # stock job reads the same version
        a["price"], b["stock"] = 10.0, 39
        if mode == "plain PUT":
            put(a)
            put(b)  # silently overwrites the price change
        else:
            put(a, IfMatch=tag_a)
            try:
                put(b, IfMatch=tag_b)
            except s3.exceptions.ClientError as e:
                print("stock job:", e.response["Error"]["Code"])
                b, tag_b = read()  # re-read, re-apply
                b["stock"] = 39
                put(b, IfMatch=tag_b)
        print(f"{mode:<13}", read()[0])`,
    },
    {
      id: 'race-out',
      kind: 'code',
      filename: 'output',
      hug: true,
      label: `plain PUT     {'price': 12.0, 'stock': 39}
stock job: PreconditionFailed
If-Match PUT  {'price': 10.0, 'stock': 39}`,
    },
  ],
  edges: [],
}
