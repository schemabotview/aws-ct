import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { runTree } from './tree'
import code from '../../../spine/run/04-purchasing/project/tools/purchase_mix.py?raw'
import session from '../../../spine/run/04-purchasing/session.txt?raw'

// m7g.large: m = general purpose, 7 = generation, g = AWS Graviton (Arm), large = 2 vCPU, 8 GiB.
// Savings Plans / Reserved Instances commit to usage for a discount; Spot can be interrupted with a
// two-minute warning. All rates are the course's HYPOTHETICAL card.
// source: https://docs.aws.amazon.com/ec2/latest/instancetypes/instance-type-names.html
// source: https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html
// source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-interruptions.html
export const purchase: Scene = ideFrame(
  'purchase-options',
  'shop-on-aws',
  runTree('04', 'tools/purchase_mix.py', ['tools/purchase_mix.py']),
  { file: 'tools/purchase_mix.py', code, highlight: [2, 5, 6, 7], terminal: session, emulated: false },
  {
    id: 'purchase-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'anatomy',
        kind: 'table',
        label: 'Reading m7g.large',
        headers: ['part', 'means'],
        values: [
          ['m', 'general purpose'],
          ['7', 'seventh generation'],
          ['g', 'Graviton, an Arm CPU'],
          ['large', '2 vCPU, 8 GiB'],
        ],
      },
      {
        id: 'buy',
        kind: 'list',
        icon: 'receipt',
        label: 'Three ways to pay',
        pattern: 'external',
        items: [
          'On-demand: no promise, the full rate',
          'Commitment: a year’s use promised, 30% off here',
          'Spot: spare capacity, cheap, taken back on 2 minutes’ notice',
          'Spot suits work that can stop: never the baseline',
        ],
      },
    ],
  },
)
