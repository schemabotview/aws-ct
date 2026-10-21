import type { Scene } from '@graphlearning/flow'
import { BUILT_BY, mapFrame } from '../map'

// The shop's organization (CLAUDE.md). Separate accounts are the strongest isolation boundary AWS
// offers: each has its own resources, IAM, quotas and bill.
// source: https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html
// source: https://docs.aws.amazon.com/whitepapers/latest/organizing-your-aws-environment/benefits-of-using-multiple-aws-accounts.html
export const org: Scene = mapFrame('org-structure', [...BUILT_BY[3], 'iam', 'accounts'], {
  id: 'org-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'org-tree',
      kind: 'tree',
      label: 'organization o-a1b2c3d4e5',
      tree: [
        {
          name: 'Root',
          note: 'management 123456789012',
          children: [
            { name: 'Security', note: 'OU', children: [{ name: 'audit', note: '777788889999' }] },
            {
              name: 'Workloads',
              note: 'OU',
              children: [
                { name: 'Prod', note: 'OU', children: [{ name: 'production', note: '111122223333', state: 'active' }] },
                { name: 'Dev', note: 'OU', children: [{ name: 'development', note: '444455556666' }] },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'isolates',
      kind: 'table',
      label: 'What a separate account keeps apart',
      headers: ['boundary', 'so that'],
      values: [
        ['resources', 'a dev script cannot touch prod'],
        ['IAM', 'a dev admin is nobody in prod'],
        ['quotas', 'a dev test cannot use up prod’s limits'],
        ['the bill', 'cost is per account, by default'],
        ['blast radius', 'a leaked dev key reaches dev only'],
      ],
    },
    {
      id: 'mgmt',
      kind: 'list',
      icon: 'organizations',
      label: 'The management account',
      pattern: 'user',
      items: [
        'Creates accounts and OUs, and pays the consolidated bill',
        'Runs no workloads: a guardrail never applies to it',
        'The audit account owns the logs that prove what happened',
      ],
    },
  ],
})
