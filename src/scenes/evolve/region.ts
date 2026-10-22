import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { evolveTree } from './tree'
import code from '../../../spine/evolve/09-region/project/evolve/region_failure.py?raw'
import session from '../../../spine/evolve/09-region/session.txt?raw'

// Cross-Region replication (RDS cross-Region read replicas, Aurora Global Database, DynamoDB global
// tables) is asynchronous, so failover loses the replication lag; Route 53 failover routing uses
// health checks (interval × failure threshold) and record TTLs; active/active with multi-writer
// data needs conflict handling. Lag, rate and Regions are assumptions (labelled model).
// source: https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/dns-failover-determining-health-of-endpoints.html
// source: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GlobalTables.html
// source: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.XRgn.html
export const region: Scene = ideFrame(
  'region-choices',
  'shop-on-aws',
  evolveTree('09', 'evolve/region_failure.py', ['evolve/region_failure.py']),
  { file: 'evolve/region_failure.py', code, show: [[3, 16]], highlight: [3, 4, 6, 8, 13, 14], terminal: session },
  {
    id: 'region-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'spread',
        kind: 'table',
        label: 'How far to spread',
        headers: ['spread', 'survives'],
        values: [
          ['one AZ', 'nothing'],
          ['three AZs', 'an AZ: today'],
          ['two Regions', 'a Region, at a cost'],
        ],
      },
      {
        id: 'region-rules',
        kind: 'list',
        icon: 'globe',
        label: 'What replication does',
        pattern: 'network',
        items: [
          'Async: the lag is lost',
          'DNS: 150 s to move people',
          'Two writers: one unit, sold twice',
          'Multi-AZ is the shop’s answer',
        ],
      },
    ],
  },
)
