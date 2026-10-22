import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { ordersTree } from './tree'
import code from '../../../spine/orders/09-migration/project/infra/09-migration.sh?raw'
import session from '../../../spine/orders/09-migration/session.txt?raw'

// DMS migrates through a replication instance between source and target endpoints;
// full-load-and-cdc copies the existing data, then applies ongoing changes from the source's log
// until cut-over. Table mappings select what moves. The specialist engines: DocumentDB, Neptune,
// Timestream, Keyspaces, MemoryDB, OpenSearch.
// source: https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Introduction.html
// source: https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Tasks.CustomizingTasks.TableMapping.html
// source: https://docs.aws.amazon.com/decision-guides/latest/databases-on-aws-how-to-choose/databases-on-aws-how-to-choose.html
export const migration: Scene = ideFrame(
  'migration-and-specialists',
  'shop-on-aws',
  ordersTree('09', 'infra/09-migration.sh', ['infra/09-migration.sh', 'infra/dms']),
  { file: 'infra/09-migration.sh', code, show: [[12, 25]], highlight: [12, 13, 20, 21, 22], terminal: session },
  {
    id: 'migration-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'specialists',
        kind: 'table',
        label: 'Engines the shop does not need',
        headers: ['engine', 'for'],
        values: [
          ['DocumentDB', 'JSON documents'],
          ['Neptune', 'graphs of relations'],
          ['Timestream', 'time series'],
          ['OpenSearch', 'full-text search'],
          ['Keyspaces', 'Cassandra'],
        ],
      },
      {
        id: 'cdc-steps',
        kind: 'list',
        icon: 'swap',
        label: 'full-load-and-cdc',
        pattern: 'storage',
        items: [
          'Copy every row once',
          'Then replay each change',
          'Cut over when lag is zero',
        ],
      },
    ],
  },
)
