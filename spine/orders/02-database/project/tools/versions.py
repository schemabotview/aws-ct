"""With versioning on, every write is kept, and a delete adds a marker."""
import boto3

s3 = boto3.client("s3")
BUCKET, KEY = "shop-catalog-111122223333", "products/p-1001.json"


def show(label, **version):
    try:
        body = s3.get_object(Bucket=BUCKET, Key=KEY, **version)["Body"].read()
        print(f"{label:22}", body.decode())
    except s3.exceptions.NoSuchKey:
        print(f"{label:22}", "NoSuchKey")


v1 = s3.put_object(Bucket=BUCKET, Key=KEY, Body=b'{"price": 12.0}')
v2 = s3.put_object(Bucket=BUCKET, Key=KEY, Body=b'{"price": 10.0}')
gone = s3.delete_object(Bucket=BUCKET, Key=KEY)  # someone deletes it
print("the delete made a marker:", gone["DeleteMarker"])
show("read the key")
show("read version 1", VersionId=v1["VersionId"])
s3.delete_object(Bucket=BUCKET, Key=KEY, VersionId=gone["VersionId"])
show("marker removed, read")
