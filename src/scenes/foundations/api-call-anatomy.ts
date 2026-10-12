import type { Scene } from '@graphlearning/flow'

// §1.5 — one CLI call taken apart: the command (identity, Region, resource), what the CLI and the
// service do with it, the response, and how ARNs name the resources involved.
// HeadObject needs s3:GetObject permission and returns headers only. New S3 objects are encrypted
// with SSE-S3 by default, hence "ServerSideEncryption": "AES256".
// source: https://docs.aws.amazon.com/IAM/latest/UserGuide/reference-arns.html (some ARNs omit the
// Region, the account ID, or both; S3 bucket ARNs omit both because bucket names are global)
export const apiCallAnatomy: Scene = {
  id: 'api-call-anatomy',
  title: 'One API call, request to response',
  cols: 1,
  padding: 0.13,
  nodes: [
    {
      id: 'request',
      label: 'The request',
      pattern: 'group',
      cols: 2,
      children: [
      {
        id: 'cli',
        kind: 'code',
        filename: 'head-object.sh · model-checked',
        hug: true,
        label: `# who: the shop-dev profile's session
  # where: eu-west-2, its Regional endpoint
  # what: one object in one bucket
  aws s3api head-object \\
    --bucket shop-catalog-444455556666 \\
    --key products/p-1001.json \\
    --region eu-west-2 \\
    --profile shop-dev`,
      },
      {
        id: 'path',
        kind: 'list',
        framed: true,
        label: 'What happens to the call',
        icon: 'braces',
        pattern: 'network',
        items: [
          '1 · find credentials for the profile',
          '2 · sign with SigV4: key, Region, service',
          '3 · HTTPS to the eu-west-2 S3 endpoint',
          '4 · IAM checks s3:GetObject on the ARN',
          '5 · 200 OK: headers only, no body',
        ],
      },
      ],
    },
    {
      id: 'response',
      kind: 'code',
      filename: 's3.HeadObject.json · model-checked',
      hug: true,
      label: `{
  "AcceptRanges": "bytes",
  "LastModified": "2026-10-12T09:14:03+00:00",
  "ContentLength": 1834,
  "ETag": "\\"9b2cf535f27731c974343645a3985328\\"",
  "ContentType": "application/json",
  "ServerSideEncryption": "AES256",
  "Metadata": {}
}`,
    },
    {
      id: 'arns',
      kind: 'code',
      filename: 'arn-shapes.txt · doc-cited',
      hug: true,
      label: `arn:partition:service:region:account:resource

# S3: no Region, no account
arn:aws:s3:::shop-catalog-444455556666
# IAM: global, so no Region
arn:aws:iam::444455556666:role/OrderApi
# DynamoDB: Regional and per account
arn:aws:dynamodb:eu-west-2:444455556666:table/Orders`,
    },
  ],
  edges: [],
}
