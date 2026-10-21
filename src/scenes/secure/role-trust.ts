import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { secureTree } from './tree'
import code from '../../../spine/secure/03-role-trust/project/policies/order-api-trust.json?raw'
import session from '../../../spine/secure/03-role-trust/session.txt?raw'

// A role has a trust policy (who may assume it) and permissions policies (what it may do). An
// instance profile is the container EC2 uses to pass a role to an instance.
// source: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_terms-and-concepts.html
// source: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_switch-role-ec2_instance-profiles.html
export const roleTrust: Scene = ideFrame(
  'role-trust',
  'shop-on-aws',
  secureTree('03', 'policies/order-api-trust.json', ['policies/order-api-trust.json', 'infra/04-roles.sh']),
  { file: 'policies/order-api-trust.json', code, highlight: [5, 6, 7, 8], terminal: session },
  {
    id: 'role-trust-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'two-policies',
        kind: 'table',
        label: 'A role answers two questions',
        headers: ['', 'trust', 'permissions'],
        values: [
          ['asks', 'who may be me?', 'what may I do?'],
          ['names', 'a Principal', 'Actions, Resources'],
          ['OrderApi', 'EC2 only', 'Course 4 §5'],
        ],
      },
      {
        id: 'profile',
        kind: 'list',
        icon: 'iam',
        label: 'Why an instance profile',
        pattern: 'user',
        items: [
          'EC2 passes a role to a server through an instance profile',
          'Same name here: OrderApi carries OrderApi',
          'Trust alone grants nothing: the role can do nothing yet',
        ],
      },
    ],
  },
)
