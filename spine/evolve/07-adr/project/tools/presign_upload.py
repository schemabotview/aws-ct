"""A review photo goes straight to S3: the app signs one PUT URL, valid for
300 seconds, and the shopper's browser uploads with no AWS credentials."""
import urllib.request
from urllib.parse import parse_qs, urlsplit

import boto3

s3 = boto3.client("s3")
BUCKET, KEY = "shop-uploads-111122223333", "reviews/p-1001/photo-77.jpg"

url = s3.generate_presigned_url(  # the app's side: sign, do not upload
    "put_object", ExpiresIn=300,
    Params={"Bucket": BUCKET, "Key": KEY, "ContentType": "image/jpeg"})
parts = urlsplit(url)
query = parse_qs(parts.query)
print("endpoint ", f"{parts.scheme}://{parts.netloc}")
print("path     ", parts.path)
print("expires  ", query["X-Amz-Expires"][0], "seconds")
print("signed by", query["X-Amz-Credential"][0].split("/")[0])

upload = urllib.request.Request(  # the browser's side: a plain HTTP PUT
    url, data=b"\xff\xd8 a photo", method="PUT",
    headers={"Content-Type": "image/jpeg"})
print("PUT      ", urllib.request.urlopen(upload).status)
stored = s3.head_object(Bucket=BUCKET, Key=KEY)["ContentLength"]
print("stored   ", stored, "bytes")
