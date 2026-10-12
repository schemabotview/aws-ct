import type { Scene } from '@graphlearning/flow'

// §5.4 — versioning and lifecycle. The program (moto, emulated) writes two versions, deletes without a
// version id (a delete MARKER is added; both versions remain), then removes the marker to undo the
// delete. The lifecycle request is validated in full: noncurrent versions expire after 30 days and
// order exports move to Standard-IA at 30 days and Glacier Flexible Retrieval at 90. Minimum storage
// durations: Standard-IA 30 days, Glacier Instant / Flexible 90, Deep Archive 180.
// source: https://docs.aws.amazon.com/AmazonS3/latest/userguide/DeletingObjectVersions.html
// source: https://docs.aws.amazon.com/AmazonS3/latest/userguide/glacier-storage-classes.html
export const versionTimeline: Scene = {
  id: 'version-timeline',
  title: 'A delete that can be undone',
  cols: 2,
  padding: 0.12,
  nodes: [
    {
      id: 'versions',
      kind: 'code',
      filename: 'versions.py · emulated',
      hug: true,
      label: `import boto3
from moto import mock_aws

B, K = "shop-catalog-111122223333", "products/p-1001.json"
with mock_aws():
    s3 = boto3.client("s3", region_name="eu-west-2")
    s3.create_bucket(Bucket=B, CreateBucketConfiguration={
        "LocationConstraint": "eu-west-2"})
    s3.put_bucket_versioning(Bucket=B, VersioningConfiguration={
        "Status": "Enabled"})
    s3.put_object(Bucket=B, Key=K, Body=b'{"price": 12.0}')
    s3.put_object(Bucket=B, Key=K, Body=b'{"price": 10.0}')
    s3.delete_object(Bucket=B, Key=K)  # no version id

    try:
        s3.get_object(Bucket=B, Key=K)
    except s3.exceptions.NoSuchKey:
        print("GET after delete: NoSuchKey")

    v = s3.list_object_versions(Bucket=B, Prefix=K)
    marker = v["DeleteMarkers"][0]
    print("delete markers:", len(v["DeleteMarkers"]),
          "| versions kept:", len(v["Versions"]))

    # undo the delete: remove the marker itself
    s3.delete_object(Bucket=B, Key=K, VersionId=marker["VersionId"])
    body = s3.get_object(Bucket=B, Key=K)["Body"].read()
    print("after removing the marker:", body.decode())`,
    },
    {
      id: 'versions-out',
      kind: 'code',
      filename: 'output',
      hug: true,
      label: `GET after delete: NoSuchKey
delete markers: 1 | versions kept: 2
after removing the marker: {"price": 10.0}`,
    },
    {
      id: 'lifecycle',
      kind: 'code',
      filename: 's3.PutBucketLifecycleConfiguration.request.json · model-checked',
      hug: true,
      label: `{
  "Bucket": "shop-catalog-111122223333",
  "LifecycleConfiguration": {
    "Rules": [
      {
        "ID": "expire-old-versions",
        "Status": "Enabled",
        "Filter": { "Prefix": "" },
        "NoncurrentVersionExpiration": {
          "NoncurrentDays": 30
        }
      },
      {
        "ID": "age-out-exports",
        "Status": "Enabled",
        "Filter": { "Prefix": "exports/" },
        "Transitions": [
          { "Days": 30, "StorageClass": "STANDARD_IA" },
          { "Days": 90, "StorageClass": "GLACIER" }
        ]
      }
    ]
  }
}`,
    },
  ],
  edges: [],
}
