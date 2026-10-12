import type { Scene } from '@graphlearning/flow'

// §2.7 — guardrails on the Workloads OU. The SCP caps what PRINCIPALS in member accounts can do (deny
// actions outside eu-west-2, except global services); the RCP caps who can reach RESOURCES (deny S3
// access from principals outside the organization, except AWS services acting for it). Neither grants
// anything; neither affects the management account. RCPs launched for S3, STS, KMS, SQS and Secrets
// Manager (Nov 2024) and have since gained services — check the current list before relying on one.
// source: https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html
// source: https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_rcps.html
export const guardrails: Scene = {
  id: 'guardrails',
  title: 'Guardrails cap permissions; they never grant',
  flow: 'TB',
  padding: 0.05,
  nodes: [
    {
      id: 'policies',
      label: 'Attached to OU Workloads',
      pattern: 'group',
      cols: 2,
      children: [
        {
          id: 'scp',
          kind: 'code',
          filename: 'scp-region.json · model-checked',
          hug: true,
          label: `{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "OnlyLondon",
    "Effect": "Deny",
    "NotAction": [
      "iam:*", "sts:*", "organizations:*",
      "route53:*", "cloudfront:*",
      "support:*", "budgets:*"
    ],
    "Resource": "*",
    "Condition": {
      "StringNotEquals": {
        "aws:RequestedRegion": "eu-west-2"
      }
    }
  }]
}`,
        },
        {
          id: 'rcp',
          kind: 'code',
          filename: 'rcp-org-only.json · model-checked',
          hug: true,
          label: `{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "OrgPrincipalsOnly",
    "Effect": "Deny",
    "Principal": "*",
    "Action": "s3:*",
    "Resource": "*",
    "Condition": {
      "StringNotEqualsIfExists": {
        "aws:PrincipalOrgID": "o-a1b2c3d4e5"
      },
      "BoolIfExists": {
        "aws:PrincipalIsAWSService": "false"
      }
    }
  }]
}`,
        },
      ],
    },
    {
      id: 'policy-kinds',
      kind: 'table',
      label: 'Who each policy limits',
      sub: 'only identity and resource policies grant',
      headers: ['policy', 'grants?', 'limits'],
      values: [
        ['identity policy', 'yes', 'its own principal'],
        ['resource policy', 'yes', 'access to that resource'],
        ['permissions boundary', 'no', 'one user or role'],
        ['SCP', 'no', 'principals in member accounts'],
        ['RCP', 'no', 'resources in member accounts'],
      ],
    },
  ],
  edges: [],
}
