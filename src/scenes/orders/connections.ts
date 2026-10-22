import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { ordersTree } from './tree'
import code from '../../../spine/orders/04-connections/project/tools/connections.py?raw'
import session from '../../../spine/orders/04-connections/session.txt?raw'

// With ManageMasterUserPassword, RDS keeps the master credentials in a Secrets Manager secret named
// rds!db-<resource id> and rotates it; moto does not create that secret, so the step's setup
// stores one of the same shape. max_connections depends on the instance's memory through the
// parameter group's formula; 200 is assumed (CLAUDE.md), and RDS Proxy pools connections across
// clients.
// source: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-secrets-manager.html
// source: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_Limits.html#RDS_Limits.MaxConnections
// source: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html
export const connections: Scene = ideFrame(
  'db-connections',
  'shop-on-aws',
  ordersTree('04', 'tools/connections.py', ['tools/connections.py']),
  { file: 'tools/connections.py', code, show: [[6, 22]], highlight: [8, 9, 14, 15, 16, 19], terminal: session },
  {
    id: 'connections-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'where-password',
        kind: 'table',
        label: 'Where the password is not',
        headers: ['place', 'why not'],
        values: [
          ['the code or a template', 'it is in git forever'],
          ['the server image', 'every copy carries it'],
          ['an environment file', 'it never rotates'],
          ['Secrets Manager', 'read at start-up: yes'],
        ],
      },
      {
        id: 'pool-fixes',
        kind: 'list',
        icon: 'rds',
        label: 'When servers outgrow connections',
        pattern: 'storage',
        items: [
          'Smaller pools: 15 each fits 12 servers',
          'RDS Proxy: one shared pool',
          'A larger instance: more memory',
          'Alarm on connections, not on errors',
        ],
      },
    ],
  },
)
