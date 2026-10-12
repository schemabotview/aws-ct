import type { Scene } from '@graphlearning/flow'

// §1.2 — the shared-responsibility line, drawn per service rather than once: who does each job for
// the ordering app's compute (EC2), database (RDS), function (Lambda) and object store (S3).
// source: https://docs.aws.amazon.com/wellarchitected/latest/security-pillar/shared-responsibility.html
// (EC2 is IaaS: the customer manages the guest OS incl. patches, installed software and the security
// group; for abstracted services such as S3 AWS operates the infrastructure, OS and platform.)
export const responsibilityMatrix: Scene = {
  id: 'responsibility-matrix',
  title: 'Who does each job, per service',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'matrix',
      kind: 'table',
      label: 'Responsibility for the ordering app',
      sub: 'AWS = provider · you = your team',
      headers: ['job', 'EC2', 'RDS', 'Lambda', 'S3'],
      values: [
        ['buildings, hardware', 'AWS', 'AWS', 'AWS', 'AWS'],
        ['host + hypervisor', 'AWS', 'AWS', 'AWS', 'AWS'],
        ['guest OS patches', 'you', 'AWS', 'AWS', '—'],
        ['engine / runtime', 'you', 'AWS*', 'AWS*', '—'],
        ['network rules', 'you', 'you', 'you', '—'],
        ['application code', 'you', 'you (SQL)', 'you', '—'],
        ['who may access', 'you', 'you', 'you', 'you'],
        ['data + backups', 'you', 'you', 'you', 'you'],
      ],
    },
    {
      id: 'who-fixes',
      kind: 'list',
      framed: true,
      label: 'Incident → owner',
      icon: 'wrench',
      pattern: 'warn',
      items: [
        'Unpatched OS on an app server → you',
        'Bucket policy allows public reads → you',
        'A failed disk under the RDS host → AWS',
        'Lambda runtime security patch → AWS',
        '* you choose versions and maintenance windows',
      ],
    },
  ],
  edges: [],
}
