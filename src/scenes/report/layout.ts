import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { reportTree } from './tree'
import code from '../../../spine/report/03-layout/project/analytics/layout.py?raw'
import session from '../../../spine/report/03-layout/session.txt?raw'

// Parquet is columnar and compressed; Hive-style partitions (dt=YYYY-MM-DD/) let engines skip
// whole folders; many small files cost per-file overhead (each has its own footer and request).
// Real Parquet written by pyarrow on this machine; sizes are what it wrote (not emulated).
// source: https://docs.aws.amazon.com/athena/latest/ug/partitions.html
// source: https://docs.aws.amazon.com/athena/latest/ug/performance-tuning.html
export const layout: Scene = ideFrame(
  'lake-layout',
  'shop-on-aws',
  reportTree('03', 'analytics/layout.py', ['analytics/history.py', 'analytics/layout.py']),
  { file: 'analytics/layout.py', code, show: [[11, 20], [29, 32]], highlight: [13, 14, 15, 18, 19], terminal: session, emulated: false },
  {
    id: 'layout-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'layouts',
        kind: 'table',
        label: 'One day of September',
        headers: ['layout', 'opens'],
        values: [
          ['one file, the month', '546 KiB'],
          ['by dt, one file a day', '27 KiB'],
          ['by dt, 200 tiny files', '433 KiB'],
        ],
      },
      {
        id: 'layout-rules',
        kind: 'list',
        icon: 'folder',
        label: 'Laying out the lake',
        pattern: 'storage',
        items: [
          'Parquet: read only the columns used',
          'Partition by what queries filter on',
          'Fewer, larger files: compact daily',
          'Too many partitions is its own cost',
        ],
      },
    ],
  },
)
