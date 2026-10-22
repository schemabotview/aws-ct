import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { evolveTree } from './tree'
import code from '../../../spine/evolve/05-bill/project/evolve/monthly_cost.py?raw'
import session from '../../../spine/evolve/05-bill/session.txt?raw'

// The bill's categories are real (NAT gateway hours and data processing, internet egress, cross-AZ
// transfer, log ingestion, backup and S3 storage, instance hours, Savings Plans / Reserved
// Instances); every PRICE here is hypothetical and labelled so on screen.
// source: https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-pricing.html
// source: https://docs.aws.amazon.com/cur/latest/userguide/cur-data-transfers-charges.html
// source: https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html
export const bill: Scene = ideFrame(
  'monthly-cost',
  'shop-on-aws',
  evolveTree('05', 'evolve/monthly_cost.py', ['evolve/monthly_cost.py']),
  { file: 'evolve/monthly_cost.py', code, show: [[9, 24]], highlight: [9, 11, 12, 22, 23, 24], terminal: session, emulated: false },
  {
    id: 'bill-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'surprises',
        kind: 'table',
        label: 'Where the money went',
        headers: ['line', 'share'],
        values: [
          ['NAT, hours + GB', '32%'],
          ['app servers', '30%'],
          ['egress', '22%'],
          ['everything else', '16%'],
        ],
      },
      {
        id: 'bill-rules',
        kind: 'list',
        icon: 'receipt',
        label: 'Reading a cloud bill',
        pattern: 'external',
        items: [
          'Prices: hypothetical, all of them',
          'Moving data costs like servers',
          'Commit only what always runs',
          '108.00 → 82.08 with 3 committed',
        ],
      },
    ],
  },
)
