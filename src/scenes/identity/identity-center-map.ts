import type { Scene } from '@graphlearning/flow'

// §2.1 — who the principals are, and how one workforce sign-in becomes a role in each account.
// Identity Center assignments are (group, account, permission set); assigning a permission set makes
// Identity Center create an `AWSReservedSSO_<set>_<suffix>` role in that account with the set's
// policies attached.
// source: https://docs.aws.amazon.com/singlesignon/latest/userguide/identity-center-and-iam-roles.html
export const identityCenterMap: Scene = {
  id: 'identity-center-map',
  title: 'From one sign-in to a role in each account',
  flow: 'TB',
  padding: 0.06,
  nodes: [
    {
      id: 'idp',
      label: 'Workforce identity source',
      sub: 'alex, sam · groups',
      pattern: 'user',
      icon: 'users',
    },
    {
      id: 'identity-center',
      label: 'IAM Identity Center',
      sub: 'one portal, MFA',
      pattern: 'service',
      icon: 'iam',
    },
    {
      id: 'assignments',
      kind: 'table',
      label: 'Assignments',
      sub: 'group × account × permission set',
      headers: ['group', 'account', 'permission set'],
      values: [
        ['Developers', 'dev 4444…6666', 'ShopDeveloper'],
        ['Developers', 'prod 1111…3333', 'ShopReadOnly'],
        ['Operators', 'prod 1111…3333', 'ShopOperator'],
      ],
    },
    {
      id: 'accounts',
      label: 'Roles Identity Center creates',
      pattern: 'group',
      cols: 2,
      children: [
        {
          id: 'dev-account',
          label: 'dev',
          pattern: 'group',
          cols: 1,
          children: [{ id: 'dev-role', label: 'AWSReserved…', sub: 'ShopDeveloper', pattern: 'service', icon: 'key' }],
        },
        {
          id: 'prod-account',
          label: 'prod',
          pattern: 'group',
          cols: 1,
          children: [
            { id: 'prod-ro', label: 'AWSReserved…', sub: 'ShopReadOnly', pattern: 'service', icon: 'key' },
            { id: 'prod-op', label: 'AWSReserved…', sub: 'ShopOperator', pattern: 'warn', icon: 'key' },
          ],
        },
      ],
    },
    {
      id: 'principals',
      kind: 'list',
      framed: true,
      label: 'Kinds of principal',
      icon: 'scanface',
      pattern: 'network',
      items: [
        'root user — the account itself',
        'IAM user — long-term credentials',
        'IAM role session — temporary',
        'AWS service — e.g. ec2.amazonaws.com',
      ],
    },
  ],
  edges: [
    { source: 'idp', target: 'identity-center', label: 'SAML sign-in' },
    { source: 'identity-center', target: 'assignments' },
    { source: 'assignments', target: 'accounts', label: 'provisions' },
  ],
}
