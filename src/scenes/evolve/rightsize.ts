import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { evolveTree } from './tree'
import code from '../../../spine/evolve/03-rightsizing/project/evolve/capacity_plans.py?raw'
import session from '../../../spine/evolve/03-rightsizing/session.txt?raw'

// Rightsizing: match instance size and count to measured demand; keep headroom for an AZ failure
// (N+1 at AZ level); smaller instances give finer steps. The day's demand is the shop's frozen
// traffic table; "medium = half a large at half the price" is an assumption.
// source: https://docs.aws.amazon.com/whitepapers/latest/cost-optimization-right-sizing/cost-optimization-right-sizing.html
// source: https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/use-fault-isolation-to-protect-your-workload.html
export const rightsize: Scene = ideFrame(
  'capacity-plans',
  'shop-on-aws',
  evolveTree('03', 'evolve/capacity_plans.py', ['evolve/capacity_plans.py']),
  { file: 'evolve/capacity_plans.py', code, show: [[10, 25]], highlight: [13, 14, 15, 16, 24], terminal: session, emulated: false },
  {
    id: 'rightsize-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'demand',
        kind: 'table',
        label: 'One day of demand',
        headers: ['hours', 'req/s', 'large'],
        values: [
          ['00–08', '60', '1'],
          ['08–18', '240', '2'],
          ['18–24', '560', '4'],
        ],
      },
      {
        id: 'rightsize-rules',
        kind: 'list',
        icon: 'scale',
        label: 'Idle is the cost',
        pattern: 'external',
        items: [
          'Fixed: 57% of hours idle',
          'Elastic: busy, but not AZ-safe',
          'AZ-safe medium: 78, still safe',
          'Smaller steps waste less',
        ],
      },
    ],
  },
)
