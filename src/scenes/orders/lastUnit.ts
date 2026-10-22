import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { ordersTree } from './tree'
import code from '../../../spine/orders/07-last-unit/project/tools/last_unit.py?raw'
import session from '../../../spine/orders/07-last-unit/session.txt?raw'

// A condition expression makes a write succeed only if the item satisfies it; TransactWriteItems
// applies up to 100 actions all-or-nothing and reports per-action CancellationReasons. Reads are
// eventually consistent by default; ConsistentRead=True returns the latest write (table and LSI
// only — a GSI read is always eventually consistent).
// source: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Expressions.ConditionExpressions.html
// source: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/transaction-apis.html
// source: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html
export const lastUnit: Scene = ideFrame(
  'dynamodb-conditions',
  'shop-on-aws',
  ordersTree('07', 'tools/last_unit.py', ['tools/last_unit.py']),
  { file: 'tools/last_unit.py', code, show: [[16, 31]], highlight: [17, 21, 26, 29, 30], terminal: session },
  {
    id: 'last-unit-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'read-kinds',
        kind: 'table',
        label: 'Which read sees the last write',
        headers: ['read', 'sees'],
        values: [
          ['default, eventual', 'usually, within a second'],
          ['ConsistentRead', 'always; twice the cost'],
          ['any GSI query', 'eventual, always'],
          ['in a transaction', 'what it committed'],
        ],
      },
      {
        id: 'condition-rules',
        kind: 'list',
        icon: 'shieldcheck',
        label: 'The table refuses, not the code',
        pattern: 'service',
        items: [
          'stock >= :q is checked at write',
          'Both actions, or neither',
          'o-602 told why: the stock check',
          'Retrying it cannot oversell',
        ],
      },
    ],
  },
)
