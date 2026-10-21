import type { Scene } from '@graphlearning/flow'
import { BUILT_BY, mapFrame } from '../map'

// Who can sign a request. People federate through IAM Identity Center into permission-set roles;
// workloads use IAM roles (on EC2 through an instance profile); AWS services act as service
// principals. The group → account → permission-set assignments are the shop's (CLAUDE.md).
// source: https://docs.aws.amazon.com/singlesignon/latest/userguide/what-is.html
// source: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html
// source: https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html
export const principals: Scene = mapFrame('principals', [...BUILT_BY[3], 'iam'], {
  id: 'principals-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'kinds',
      kind: 'table',
      label: 'Who can sign a request',
      headers: ['principal', 'how it gets credentials', 'in the shop'],
      values: [
        ['a person', 'signs in to Identity Center, gets a role', 'alex, sam'],
        ['a workload', 'its server or task assumes a role', 'OrderApi'],
        ['an AWS service', 'named in a trust policy', 'ec2.amazonaws.com'],
        ['root', 'the account’s own email and password', 'locked away'],
        ['an IAM user', 'a long-lived access key', 'not used'],
      ],
    },
    {
      id: 'assignments',
      kind: 'table',
      label: 'Identity Center: group, account, permission set',
      headers: ['group', 'account', 'permission set'],
      values: [
        ['Developers (alex)', 'dev 444455556666', 'ShopDeveloper'],
        ['Developers (alex)', 'prod 111122223333', 'ShopReadOnly'],
        ['Operators (sam)', 'prod 111122223333', 'ShopOperator'],
      ],
    },
    {
      id: 'federation',
      kind: 'list',
      icon: 'usercheck',
      label: 'Authentication, then authorisation',
      pattern: 'user',
      items: [
        'Authentication proves who: a password and MFA, at the identity source',
        'Federation turns that proof into temporary role credentials',
        'Authorisation decides what: the role’s policies, on every request',
        'A permission set becomes one role in each account it is assigned to',
      ],
    },
  ],
})
