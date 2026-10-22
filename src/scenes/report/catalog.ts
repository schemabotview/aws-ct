import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { reportTree } from './tree'
import code from '../../../spine/report/04-catalog/project/infra/11-catalog.sh?raw'
import session from '../../../spine/report/04-catalog/session.txt?raw'

// The Glue Data Catalog holds databases, tables (schema, location, format, partition keys) and keeps
// table versions on update; partitions can be registered by API, a crawler or partition projection.
// Lake Formation grants SELECT on tables or columns (ColumnWildcard with ExcludedColumnNames).
// source: https://docs.aws.amazon.com/glue/latest/dg/components-overview.html
// source: https://docs.aws.amazon.com/glue/latest/dg/add-crawler.html
// source: https://docs.aws.amazon.com/lake-formation/latest/dg/granting-table-permissions.html
export const catalog: Scene = ideFrame(
  'glue-catalog',
  'shop-on-aws',
  reportTree('04', 'infra/11-catalog.sh', ['infra/11-catalog.sh', 'infra/glue', 'analytics/add_column.py']),
  { file: 'infra/11-catalog.sh', code, show: [[5, 21]], highlight: [6, 7, 10, 17, 18, 21], terminal: session },
  {
    id: 'catalog-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'promises',
        kind: 'table',
        label: 'What the catalog promises',
        headers: ['promise', 'held in'],
        values: [
          ['where the files are', 'Location'],
          ['how to read them', 'Parquet SerDe'],
          ['which columns', 'Columns, versioned'],
          ['which days exist', 'partitions'],
          ['who sees what', 'Lake Formation'],
        ],
      },
      {
        id: 'schema-change',
        kind: 'list',
        icon: 'glue',
        label: 'Adding channel',
        pattern: 'service',
        items: [
          'Version 2 of the table',
          'Old files: channel is null',
          'Renaming breaks readers',
          'Analyst: no customer column',
        ],
      },
    ],
  },
)
