import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { evolveTree } from './tree'
import code from '../../../spine/evolve/06-footprint/project/evolve/footprint.py?raw'
import session from '../../../spine/evolve/06-footprint/session.txt?raw'

// The Sustainability pillar: maximise utilisation, reduce data stored and moved, use managed and
// efficient (e.g. Graviton) resources; the Customer Carbon Footprint Tool reports emissions. The
// script uses proxies (server-hours, GB stored, GB moved), not carbon. Log retention is set with
// put-retention-policy (moto stores it).
// source: https://docs.aws.amazon.com/wellarchitected/latest/sustainability-pillar/sustainability-pillar.html
// source: https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html#SettingLogRetention
export const sustain: Scene = ideFrame(
  'sustainability-levers',
  'shop-on-aws',
  evolveTree('06', 'evolve/footprint.py', ['evolve/footprint.py']),
  { file: 'evolve/footprint.py', code, show: [[3, 16]], highlight: [3, 8, 9, 14, 15], terminal: session },
  {
    id: 'sustain-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'levers',
        kind: 'table',
        label: 'Each lever, and what it must keep',
        headers: ['lever', 'keeps'],
        values: [
          ['smaller servers', 'AZ safety'],
          ['30-day logs', 'incident evidence'],
          ['edge caching', 'pages ≤ 60 s old'],
        ],
      },
      {
        id: 'sustain-rules',
        kind: 'list',
        icon: 'zap',
        label: 'Less, not just cheaper',
        pattern: 'storage',
        items: [
          'Idle servers burn power',
          'Data kept is data stored',
          'Proxies here, not carbon',
          'Graviton: less energy a request',
        ],
      },
    ],
  },
)
