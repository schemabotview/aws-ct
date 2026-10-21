"""Print the parts of one signed request to S3, then the answer."""
import boto3

s3 = boto3.client("s3")


def show(request, **_):
    auth = request.headers["Authorization"].decode()
    algorithm, rest = auth.split(" ", 1)
    fields = dict(p.strip().split("=", 1) for p in rest.split(","))
    key_id, day, region, service, _ = fields["Credential"].split("/")
    print("method       ", request.method)
    print("url          ", request.url)
    print("algorithm    ", algorithm)
    print("access key   ", key_id)
    print("scope        ", day, region, service)
    print("signed       ", fields["SignedHeaders"])
    print("signature    ", fields["Signature"])


s3.meta.events.register("before-send.s3.HeadObject", show)
head = s3.head_object(Bucket="shop-catalog-111122223333", Key="products/p-1001.json")
print("status       ", head["ResponseMetadata"]["HTTPStatusCode"])
print("length       ", head["ContentLength"], "bytes")
