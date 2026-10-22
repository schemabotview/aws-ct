import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { ordersTree } from './tree'
import code from '../../../spine/orders/03-transaction/project/sql/place_order.sql?raw'
import session from '../../../spine/orders/03-transaction/session.txt?raw'

// Run in a real PostgreSQL 16, the engine shop-orders runs on RDS. In a transaction block, an
// error aborts the transaction and COMMIT then ends it with ROLLBACK: nothing it did persists.
// source: https://www.postgresql.org/docs/16/tutorial-transactions.html
// source: https://www.postgresql.org/docs/16/ddl-constraints.html#DDL-CONSTRAINTS-CHECK-CONSTRAINTS
export const transaction: Scene = ideFrame(
  'order-transaction',
  'shop-on-aws',
  ordersTree('03', 'sql/place_order.sql', ['sql']),
  { file: 'sql/place_order.sql', code, highlight: [2, 6, 7], terminal: session, emulated: false },
  {
    id: 'transaction-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'order-501',
        kind: 'table',
        label: 'Order 501, inside the transaction',
        headers: ['statement', 'result'],
        values: [
          ['the order row', 'inserted'],
          ['its two lines', 'inserted'],
          ['p-1001: 40 → 38', 'updated'],
          ['p-1002: 1 → −1', 'CHECK fails'],
          ['COMMIT', 'ROLLBACK'],
        ],
      },
      {
        id: 'acid',
        kind: 'list',
        icon: 'rds',
        label: 'All of it, or none of it',
        pattern: 'storage',
        items: [
          'Stock is back at 40 and 1',
          'No order 501, no orphan lines',
          'The rule lives in the schema',
          'Every caller gets the same rule',
        ],
      },
    ],
  },
)
