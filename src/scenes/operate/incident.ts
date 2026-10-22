import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { operateTree } from './tree'
import code from '../../../spine/operate/07-incident/project/policies/revoke-sessions.json?raw'
import session from '../../../spine/operate/07-incident/session.txt?raw'

// Temporary role credentials cannot be revoked one by one; a deny on aws:TokenIssueTime before a
// time (what the IAM console's "revoke active sessions" adds) blocks every session issued earlier,
// while new sessions keep working. moto stores the policy but does not evaluate the condition.
// source: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_use_revoke-sessions.html
// source: https://docs.aws.amazon.com/whitepapers/latest/aws-security-incident-response-guide/aws-security-incident-response-guide.html
export const incident: Scene = ideFrame(
  'incident-containment',
  'shop-on-aws',
  operateTree('07', 'policies/revoke-sessions.json', ['policies/revoke-sessions.json', 'runbooks']),
  { file: 'policies/revoke-sessions.json', code, highlight: [6, 7, 8, 10], terminal: session },
  {
    id: 'incident-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'incident-timeline',
        kind: 'table',
        label: '12 October, OrderApi’s keys',
        headers: ['time', 'step'],
        values: [
          ['18:19', 'GuardDuty: keys used'],
          ['18:21', 'sam leads, alex notes'],
          ['18:24', 'revoke before 18:20'],
          ['18:30', 'logs copied, disks snap'],
          ['19:10', 'leak fixed, rotated'],
        ],
      },
      {
        id: 'contain-rules',
        kind: 'list',
        icon: 'shieldcheck',
        label: 'Contain first, then explain',
        pattern: 'warn',
        items: [
          'Stolen sessions stop; new ones work',
          'From 198.51.100.66, not the shop',
          'The runbook names the owner',
        ],
      },
    ],
  },
)
