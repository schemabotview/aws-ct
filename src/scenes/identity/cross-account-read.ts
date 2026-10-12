import type { Scene } from '@graphlearning/flow'

// §2.5 — a resource policy and a cross-account read. The audit account's Auditor role (777788889999)
// reads nightly reports from production's bucket (111122223333): the bucket policy must name the role
// AND the role's own policy must allow the read. Same account, either side's Allow suffices — except
// where the resource policy is mandatory (role trust policies, KMS key policies).
// source: https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic-cross-account.html
// source: https://docs.aws.amazon.com/kms/latest/developerguide/control-access.html
export const crossAccountRead: Scene = {
  id: 'cross-account-read',
  title: 'Both sides must say yes',
  flow: 'TB',
  padding: 0.05,
  nodes: [
    {
      id: 'sides',
      label: 'Auditor (audit 7777…9999) reads shop-reports (prod 1111…3333)',
      pattern: 'group',
      cols: 2,
      children: [
        {
          id: 'bucket-policy',
          kind: 'code',
          filename: 'bucket-policy.json · model-checked',
          hug: true,
          label: `{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "AuditorRead",
    "Effect": "Allow",
    "Principal": {
      "AWS":
        "arn:aws:iam::777788889999:role/Auditor"
    },
    "Action": "s3:GetObject",
    "Resource":
      "arn:aws:s3:::shop-reports-111122223333/*"
  }]
}`,
        },
        {
          id: 'auditor-policy',
          kind: 'code',
          filename: 'auditor-policy.json · model-checked',
          hug: true,
          label: `{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "ReadProdReports",
    "Effect": "Allow",
    "Action": "s3:GetObject",
    "Resource":
      "arn:aws:s3:::shop-reports-111122223333/*"
  }]
}`,
        },
      ],
    },
    {
      id: 'who-must-allow',
      kind: 'table',
      label: 'Which Allows are enough?',
      sub: 'no explicit Deny anywhere',
      headers: ['caller', 'identity Allow', 'resource Allow', 'result'],
      values: [
        ['same account', 'yes', 'no', 'allowed'],
        ['same account', 'no', 'yes', 'allowed'],
        ['other account', 'yes', 'no', 'denied'],
        ['other account', 'no', 'yes', 'denied'],
        ['other account', 'yes', 'yes', 'allowed'],
      ],
    },
  ],
  edges: [],
}
