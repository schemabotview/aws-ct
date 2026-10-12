import type { Scene } from '@graphlearning/flow'

// §10.7 — a compromised-role containment sequence. GuardDuty reports OrderApi credentials used from an
// unknown address; the responder revokes every session issued before 18:20 with a Deny on
// aws:TokenIssueTime (the documented "revoke active sessions" policy, parliament-checked), keeps the
// evidence, then fixes the cause. The alarm and the finding notified; people acted.
// source: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_revoke-sessions.html
export const incidentContainment: Scene = {
  id: 'incident-containment',
  title: 'Contain first, then investigate',
  cols: 2,
  padding: 0.12,
  nodes: [
    {
      id: 'sequence',
      label: 'OrderApi keys used from 198.51.100.66',
      pattern: 'group',
      flow: 'TB',
      children: [
        { id: 'i-detect', label: '18:19 Detect', sub: 'GuardDuty finding', pattern: 'warn', icon: 'guardduty' },
        { id: 'i-own', label: '18:21 Own it', sub: 'one incident lead', pattern: 'user', icon: 'usercheck' },
        { id: 'i-contain', label: '18:24 Contain', sub: 'revoke old sessions', pattern: 'warn', icon: 'ban' },
        { id: 'i-preserve', label: '18:30 Preserve', sub: 'CloudTrail, snapshots', pattern: 'storage', icon: 'cloudtrail' },
        { id: 'i-fix', label: '19:10 Eradicate', sub: 'fix the leak, redeploy', pattern: 'service', icon: 'wrench' },
      ],
      edges: [
        { source: 'i-detect', target: 'i-own' },
        { source: 'i-own', target: 'i-contain' },
        { source: 'i-contain', target: 'i-preserve' },
        { source: 'i-preserve', target: 'i-fix' },
      ],
    },
    {
      id: 'revoke',
      kind: 'code',
      filename: 'revoke-older-sessions.json · model-checked',
      hug: true,
      label: `{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "RevokeOlderSessions",
    "Effect": "Deny",
    "Action": "*",
    "Resource": "*",
    "Condition": {
      "DateLessThan": {
        "aws:TokenIssueTime": "2026-10-12T18:20:00Z"
      }
    }
  }]
}`,
    },
  ],
  edges: [],
}
