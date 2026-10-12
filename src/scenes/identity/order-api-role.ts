import type { Scene } from '@graphlearning/flow'

// §2.2 — the order API's workload role in production (111122223333): its trust policy (who may become
// it), its permissions policy (what it may then do), and the CLI that builds it and hands it to EC2
// through an instance profile.
// source: https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html (DurationSeconds
// defaults to 3,600 s; 900 s up to the role's maximum session duration, 1–12 h; role chaining 1 h)
export const orderApiRole: Scene = {
  id: 'order-api-role',
  title: 'A role is two policies',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'policies',
      label: 'Role OrderApi · production account',
      pattern: 'group',
      cols: 2,
      children: [
        {
          id: 'trust',
          kind: 'code',
          filename: 'trust.json · model-checked',
          hug: true,
          label: `{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {
      "Service": "ec2.amazonaws.com"
    },
    "Action": "sts:AssumeRole"
  }]
}`,
        },
        {
          id: 'permissions',
          kind: 'code',
          filename: 'permissions.json · model-checked',
          hug: true,
          label: `{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": "s3:GetObject",
    "Resource":
      "arn:aws:s3:::shop-catalog-111122223333/*"
  }, {
    "Effect": "Allow",
    "Action": "sqs:SendMessage",
    "Resource":
      "arn:aws:sqs:eu-west-2:111122223333:order-events"
  }]
}`,
        },
      ],
    },
    {
      id: 'create',
      kind: 'code',
      filename: 'create-role.sh · model-checked',
      hug: true,
      label: `aws iam create-role --role-name OrderApi \\
  --assume-role-policy-document file://trust.json
aws iam put-role-policy --role-name OrderApi \\
  --policy-name OrderApiAccess \\
  --policy-document file://permissions.json
aws iam create-instance-profile \\
  --instance-profile-name OrderApi
aws iam add-role-to-instance-profile \\
  --instance-profile-name OrderApi --role-name OrderApi`,
    },
    {
      id: 'on-instance',
      kind: 'list',
      framed: true,
      label: 'On the app server',
      icon: 'ec2',
      pattern: 'service',
      items: [
        'EC2 assumes OrderApi for the instance',
        'IMDSv2 serves the temporary keys',
        'the SDK finds them — no keys in code',
        'new keys arrive before the old expire',
      ],
    },
  ],
  edges: [
    { source: 'policies', target: 'create', label: 'file://' },
    { source: 'create', target: 'on-instance', label: 'at run time' },
  ],
}
