import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { ordersTree } from './tree'
import code from '../../../spine/orders/06-keys/project/tools/orders_table.py?raw'
import session from '../../../spine/orders/06-keys/session.txt?raw'

// DynamoDB stores items by partition key; a Query names one partition key value and may bound the
// sort key. A GSI has its own key schema; a low-cardinality partition key (status) concentrates
// traffic on few partitions. On-demand capacity charges per request; provisioned capacity sets
// read/write units.
// source: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html
// source: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-partition-key-design.html
// source: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.html
// source: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/capacity-mode.html
export const keys: Scene = ideFrame(
  'dynamodb-keys',
  'shop-on-aws',
  ordersTree('06', 'tools/orders_table.py', ['tools/orders_table.py']),
  { file: 'tools/orders_table.py', code, show: [[28, 43]], highlight: [29, 30, 34, 35, 39, 40, 42], terminal: session },
  {
    id: 'keys-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'key-schema',
        kind: 'table',
        label: 'Orders, on demand',
        headers: ['key', 'holds'],
        values: [
          ['partition: customer', 'c-17'],
          ['sort: sk', '<time>#<order>'],
          ['index by-status', 'placed / shipped'],
        ],
      },
      {
        id: 'key-rules',
        kind: 'list',
        icon: 'dynamodb',
        label: 'The keys are the questions',
        pattern: 'service',
        items: [
          'Query names one partition key',
          'The sort key gives order and ranges',
          'Two status values: a hot key',
          'Better: status plus a day',
        ],
      },
    ],
  },
)
