import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { reportTree } from './tree'
import code from '../../../spine/report/05-athena/project/sql/daily_sales.sql?raw'
import session from '../../../spine/report/05-athena/session.txt?raw'

// Athena runs SQL on S3 through the Glue catalog and charges per TB scanned ($5 in most Regions),
// rounded up to 10 MB per query; partition pruning and columnar formats cut bytes scanned. Here
// DuckDB runs the same SQL on the local Parquet (labelled, not Athena); moto records the Athena
// query but returns no results.
// source: https://aws.amazon.com/athena/pricing/
// source: https://docs.aws.amazon.com/athena/latest/ug/performance-tuning.html
export const athena: Scene = ideFrame(
  'athena-query',
  'shop-on-aws',
  reportTree('05', 'sql/daily_sales.sql', ['sql/daily_sales.sql', 'analytics/daily_sales_duckdb.py']),
  { file: 'sql/daily_sales.sql', code, highlight: [2, 4], terminal: session },
  {
    id: 'athena-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'scan-cost',
        kind: 'table',
        label: 'Paying by the byte',
        headers: ['', 'value'],
        values: [
          ['price', '$5 per TB scanned'],
          ['minimum', '10 MB a query'],
          ['by dt, 3 days', '81 KiB'],
          ['flat, the month', '546 KiB'],
        ],
      },
      {
        id: 'athena-rules',
        kind: 'list',
        icon: 'athena',
        label: 'Same SQL, two engines',
        pattern: 'service',
        items: [
          'Results: DuckDB, locally',
          'Athena: submitted to moto',
          'Filter on the partition column',
          'Select columns, never *',
        ],
      },
    ],
  },
)
