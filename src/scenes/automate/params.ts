import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { automateTree } from './tree'
import code from '../../../spine/automate/04-params-outputs/project/templates/filters.yaml?raw'
import session from '../../../spine/automate/04-params-outputs/session.txt?raw'

// Parameters take values at deploy time; Outputs with Export are read by other stacks through
// Fn::ImportValue, and an exported value cannot be changed or removed while it is imported. Secrets
// belong in dynamic references ({{resolve:secretsmanager:…}}) or service-managed secrets, never in a
// template or a parameter default — templates and parameters are visible to anyone who can describe
// the stack.
// source: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/outputs-section-structure.html
// source: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html
// source: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/security-best-practices.html
export const params: Scene = ideFrame(
  'params-and-secrets',
  'shop-on-aws',
  automateTree('04', 'templates/filters.yaml', ['templates/filters.yaml']),
  { file: 'templates/filters.yaml', code, show: [[4, 6], [17, 23], [33, 35]], highlight: [4, 20, 22, 23, 35], terminal: session },
  {
    id: 'params-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'links',
        kind: 'table',
        label: 'Four ways a template refers',
        headers: ['write', 'gets'],
        values: [
          ['!Ref AppPort', 'a parameter'],
          ['!GetAtt X.GroupId', 'an attribute'],
          ['Export: shop-sg-app', 'offered to stacks'],
          ['!ImportValue …', 'another stack’s'],
        ],
      },
      {
        id: 'no-secrets',
        kind: 'list',
        icon: 'key',
        label: 'Never a secret in a template',
        pattern: 'warn',
        items: [
          'Anyone who can read the stack can read it',
          'Use {{resolve:secretsmanager:…}} instead',
          'Or let RDS manage it: Course 9',
          'An imported export cannot change under you',
        ],
      },
    ],
  },
)
