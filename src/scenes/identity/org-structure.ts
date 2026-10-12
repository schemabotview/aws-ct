import type { Scene } from '@graphlearning/flow'

// §2.6 — the shop's organization: a management account at the root, a Security OU with the audit
// account, and a Workloads OU split into Prod and Dev. Accounts are the isolation boundary; OUs are
// where policies attach.
// source: https://docs.aws.amazon.com/organizations/latest/userguide/orgs_getting-started_concepts.html
export const orgStructure: Scene = {
  id: 'org-structure',
  title: 'Accounts grouped into organisational units',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'org',
      label: 'Organization root · management 1234…9012',
      pattern: 'group',
      cols: 1,
      children: [
        {
          id: 'ou-security',
          label: 'OU Security',
          pattern: 'group',
          cols: 1,
          children: [
            { id: 'acct-audit', label: 'audit', sub: '777788889999', pattern: 'external', icon: 'cloudtrail' },
          ],
        },
        {
          id: 'ou-workloads',
          label: 'OU Workloads',
          pattern: 'group',
          cols: 2,
          children: [
            {
              id: 'ou-prod',
              label: 'OU Prod',
              pattern: 'group',
              cols: 1,
              children: [{ id: 'acct-prod', label: 'shop-prod', sub: '111122223333', pattern: 'warn', icon: 'awscloud' }],
            },
            {
              id: 'ou-dev',
              label: 'OU Dev',
              pattern: 'group',
              cols: 1,
              children: [{ id: 'acct-dev', label: 'shop-dev', sub: '444455556666', pattern: 'service', icon: 'awscloud' }],
            },
          ],
        },
      ],
    },
    {
      id: 'isolation',
      kind: 'table',
      label: 'What separate accounts separate',
      sub: 'dev ↔ prod',
      headers: ['boundary', 'effect'],
      values: [
        ['permissions', 'a dev Admin has no rights in prod'],
        ['resources', 'dev deletes cannot reach prod'],
        ['quotas', 'a dev load test cannot use prod limits'],
        ['bills', 'cost per account, one consolidated bill'],
      ],
    },
  ],
  edges: [],
}
