import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { reportTree } from './tree'
import code from '../../../spine/report/02-reconcile/project/analytics/reconcile.py?raw'
import session from '../../../spine/report/02-reconcile/session.txt?raw'

// Ingestion options: a scheduled export (RDS snapshot export to S3 in Parquet), change data capture
// (DMS full-load-and-cdc to S3), and managed transfer (AWS Transfer Family, DataSync, AppFlow).
// CDC delivers at least once and by arrival; reconciliation dedupes by log position and buckets by
// commit time. The script is plain Python on local files (not emulated).
// source: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ExportSnapshot.html
// source: https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.S3.html
// source: https://docs.aws.amazon.com/datasync/latest/userguide/what-is-datasync.html
export const reconcile: Scene = ideFrame(
  'cdc-reconcile',
  'shop-on-aws',
  reportTree('02', 'analytics/reconcile.py', ['analytics', 'lake']),
  { file: 'analytics/reconcile.py', code, show: [[9, 25]], highlight: [10, 17, 19, 21, 23], terminal: session, emulated: false },
  {
    id: 'reconcile-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'ingest',
        kind: 'table',
        label: 'Getting the data out',
        headers: ['way', 'fits'],
        values: [
          ['nightly export', 'a day late is fine'],
          ['CDC, DMS', 'minutes, every change'],
          ['file transfer', 'partners’ files'],
        ],
      },
      {
        id: 'cdc-traps',
        kind: 'list',
        icon: 'dms',
        label: 'What a day’s file is not',
        pattern: 'network',
        items: [
          'o-502 twice: a replayed record',
          'o-503 twice: an insert, then an update',
          'o-504: placed 23:58, arrived 00:04',
          'Check the total against the source',
        ],
      },
    ],
  },
)
