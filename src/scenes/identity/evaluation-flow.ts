import type { Scene } from '@graphlearning/flow'

// §2.4 — how one same-account request is decided, and the order API's permission matrix under a policy
// that adds an explicit Deny on drafts. The matrix outcomes are asserted against moto's IAM
// enforcement by verify/identity/permission_matrix.py (emulator evidence, as the table says). The
// denied-request message is illustrative: AWS's AccessDenied text names the policy type that decided
// ("with an explicit deny in an identity-based policy" / "because no identity-based policy allows").
// source: https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html
// source: https://docs.aws.amazon.com/AmazonS3/latest/userguide/troubleshoot-403-errors.html
export const evaluationFlow: Scene = {
  id: 'evaluation-flow',
  title: 'Deny wins, then an Allow is needed',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'decision',
      label: 'One request, same account',
      pattern: 'group',
      cols: 3,
      children: [
        { id: 'step-deny', label: 'Explicit Deny?', sub: 'any policy → DENY', pattern: 'warn', icon: 'ban' },
        { id: 'step-allow', label: 'An Allow?', sub: 'identity or resource', pattern: 'service', icon: 'circlecheck' },
        { id: 'step-none', label: 'Nothing matched', sub: 'implicit DENY', pattern: 'external', icon: 'circleslash' },
      ],
    },
    {
      id: 'deny-drafts',
      kind: 'code',
      filename: 'deny-drafts.json · model-checked',
      hug: true,
      label: `{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "DenyDrafts",
    "Effect": "Deny",
    "Action": "s3:GetObject",
    "Resource":
      "arn:aws:s3:::shop-catalog-111122223333/products/drafts/*"
  }]
}`,
    },
    {
      id: 'matrix',
      kind: 'table',
      label: 'OrderApi permission matrix',
      sub: 'outcomes checked in moto’s emulator',
      headers: ['request', 'decision', 'why'],
      values: [
        ['GetObject products/p-1001.json', 'Allow', 'ReadProducts'],
        ['GetObject products/drafts/p-2000.json', 'Deny', 'explicit Deny'],
        ['GetObject private/costs.csv', 'Deny', 'no Allow'],
        ['PutObject products/p-1001.json', 'Deny', 'no Allow'],
        ['SendMessage order-events', 'Allow', 'SendOrderEvents'],
      ],
    },
    {
      id: 'denied',
      kind: 'code',
      filename: 'denied.txt · illustrative',
      hug: true,
      label: `$ aws s3api get-object --bucket shop-catalog-111122223333 \\
    --key products/drafts/p-2000.json p.json
An error occurred (AccessDenied) when calling the
GetObject operation: User: arn:aws:sts::111122223333:
assumed-role/OrderApi/i-0abc12 is not authorized to
perform: s3:GetObject on resource: "arn:aws:s3:::
shop-catalog-111122223333/products/drafts/p-2000.json"
with an explicit deny in an identity-based policy`,
    },
  ],
  edges: [],
}
