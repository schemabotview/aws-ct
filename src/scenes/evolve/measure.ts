import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { evolveTree } from './tree'
import code from '../../../spine/evolve/01-saturation/project/evolve/saturation.py?raw'
import session from '../../../spine/evolve/01-saturation/session.txt?raw'

// Queueing: as utilisation approaches 100%, waiting time grows sharply and the tail first; measure
// throughput and latency percentiles under increasing load before tuning. The server here is a
// simulation (labelled), not a load test of AWS.
// source: https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/welcome.html
// source: https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html#Percentiles
export const measure: Scene = ideFrame(
  'saturation-curve',
  'shop-on-aws',
  evolveTree('01', 'evolve/saturation.py', ['evolve']),
  { file: 'evolve/saturation.py', code, show: [[11, 27]], highlight: [14, 15, 16, 22, 25], terminal: session, emulated: false },
  {
    id: 'measure-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'signals',
        kind: 'table',
        label: 'Saturation shows first in',
        headers: ['signal', 'at 98% busy'],
        values: [
          ['p50', '92 → 206 ms'],
          ['p99', '251 → 614 ms'],
          ['throughput', 'flat: 147 req/s'],
          ['CPU', 'near 100%'],
        ],
      },
      {
        id: 'measure-rules',
        kind: 'list',
        icon: 'gauge',
        label: 'Before tuning anything',
        pattern: 'service',
        items: [
          'Measure percentiles, not means',
          'Find the knee: here past 90%',
          'Plan to run below it: §3',
          'A simulation, not AWS',
        ],
      },
    ],
  },
)
