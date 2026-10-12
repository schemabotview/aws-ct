import type { Scene } from '@graphlearning/flow'

// §2.3 — one policy read statement by statement: the order API's permissions once it also lists the
// catalogue's products. ListBucket acts on the BUCKET ARN, GetObject on OBJECT ARNs; the s3:prefix
// condition narrows which listing requests the allow matches.
// source: https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements.html
export const policyAnatomy: Scene = {
  id: 'policy-anatomy',
  title: 'Reading a policy statement',
  flow: 'TB',
  padding: 0.05,
  nodes: [
    {
      id: 'policy',
      kind: 'code',
      filename: 'order-api-access.json · model-checked',
      hug: true,
      label: `{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "ReadProducts",
      "Effect": "Allow",
      "Action": "s3:GetObject",
      "Resource":
        "arn:aws:s3:::shop-catalog-111122223333/products/*"
    },
    {
      "Sid": "ListProducts",
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource":
        "arn:aws:s3:::shop-catalog-111122223333",
      "Condition": {
        "StringLike": { "s3:prefix": "products/*" }
      }
    },
    {
      "Sid": "SendOrderEvents",
      "Effect": "Allow",
      "Action": "sqs:SendMessage",
      "Resource":
        "arn:aws:sqs:eu-west-2:111122223333:order-events"
    }
  ]
}`,
    },
    {
      id: 'parts',
      kind: 'list',
      framed: true,
      label: 'Each statement answers four questions',
      icon: 'scroll',
      pattern: 'network',
      items: [
        'Effect — Allow or Deny',
        'Action — which API calls: service:Name',
        'Resource — which ARNs; * is a wildcard',
        'Condition — only when the request matches',
      ],
    },
  ],
  edges: [],
}
