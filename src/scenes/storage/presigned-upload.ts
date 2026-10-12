import type { Scene } from '@graphlearning/flow'

// §5.2 — a controlled upload path: shoppers upload review photos straight to S3 with a URL the order
// API signs (SigV4, five minutes), so bytes never pass through the app servers. The program really
// signs a URL (placeholder credentials, no network); only the parameter names and expiry are printed
// because the date and signature change every run. A presigned URL expires at ExpiresIn or when the
// signing credentials expire, whichever is first; the SigV4 maximum is 7 days.
// source: https://docs.aws.amazon.com/AmazonS3/latest/userguide/using-presigned-url.html
export const presignedUpload: Scene = {
  id: 'presigned-upload',
  title: 'Uploads that skip the app server',
  cols: 2,
  padding: 0.05,
  nodes: [
    {
      id: 'flow',
      label: 'Upload sequence',
      pattern: 'group',
      flow: 'TB',
      children: [
        { id: 'f-ask', label: '1 · Browser asks', sub: 'POST /reviews/photo', pattern: 'user', icon: 'globe' },
        { id: 'f-sign', label: '2 · Order API signs', sub: 'its role may PutObject', pattern: 'service', icon: 'key' },
        { id: 'f-put', label: '3 · Browser PUTs', sub: 'straight to S3', pattern: 'storage', icon: 's3' },
        { id: 'f-check', label: '4 · S3 checks', sub: 'signature, expiry, policy', pattern: 'network', icon: 'shieldcheck' },
      ],
      edges: [
        { source: 'f-ask', target: 'f-sign' },
        { source: 'f-sign', target: 'f-put', label: 'URL, 5 min' },
        { source: 'f-put', target: 'f-check' },
      ],
    },
    {
      id: 'code',
      label: 'Signing, for real',
      pattern: 'group',
      cols: 1,
      children: [
        {
          id: 'presign',
          kind: 'code',
          filename: 'presign_upload.py · runs locally',
          hug: true,
          label: `from urllib.parse import parse_qs, urlsplit

import boto3
from botocore.config import Config

# the app's temporary role credentials (placeholders)
s3 = boto3.client(
    "s3", region_name="eu-west-2",
    endpoint_url="https://s3.eu-west-2.amazonaws.com",
    config=Config(s3={"addressing_style": "virtual"}),
    aws_access_key_id="ASIAEXAMPLEKEY",
    aws_secret_access_key="example-secret",
    aws_session_token="example-session-token",
)
url = s3.generate_presigned_url(
    "put_object",
    Params={"Bucket": "shop-uploads-111122223333",
            "Key": "reviews/p-1001/photo-77.jpg",
            "ContentType": "image/jpeg"},
    ExpiresIn=300,  # five minutes
)
parts = urlsplit(url)
query = parse_qs(parts.query)
print("PUT", parts.netloc)
print("   ", parts.path)
for name in sorted(query):
    shown = query[name][0] if name in (
        "X-Amz-Algorithm", "X-Amz-Expires") else "…"
    print(f"  {name} = {shown}")`,
        },
        {
          id: 'presign-out',
          kind: 'code',
          filename: 'output',
          hug: true,
          label: `PUT shop-uploads-111122223333.s3.eu-west-2.amazonaws.com
    /reviews/p-1001/photo-77.jpg
  X-Amz-Algorithm = AWS4-HMAC-SHA256
  X-Amz-Credential = …
  X-Amz-Date = …
  X-Amz-Expires = 300
  X-Amz-Security-Token = …
  X-Amz-Signature = …
  X-Amz-SignedHeaders = …`,
        },
      ],
    },
  ],
  edges: [],
}
