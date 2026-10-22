import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { evolveTree } from './tree'
import code from '../../../spine/evolve/04-cost/project/evolve/cost_lines.py?raw'
import session from '../../../spine/evolve/04-cost/session.txt?raw'

// Cost allocation tags must be activated before they appear in billing data; Cost Explorer and the
// Cost and Usage Report break costs down by tag; Cost Anomaly Detection flags unusual spend; AWS
// Budgets alert on actual or forecasted cost. The week's lines are an example file (cost/week.csv);
// moto stores the budget and its notification.
// source: https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html
// source: https://docs.aws.amazon.com/cost-management/latest/userguide/manage-ad.html
// source: https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html
export const allocation: Scene = ideFrame(
  'cost-allocation',
  'shop-on-aws',
  evolveTree('04', 'evolve/cost_lines.py', ['cost', 'evolve/cost_lines.py', 'infra/13-budget.sh', 'infra/budgets']),
  { file: 'evolve/cost_lines.py', code, show: [[7, 23]], highlight: [10, 12, 17, 19, 21], terminal: session },
  {
    id: 'allocation-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'nat-find',
        kind: 'table',
        label: 'The 9 October line',
        headers: ['', 'value'],
        values: [
          ['NAT gateway', '42.20 vs 3.80'],
          ['extra traffic', '768 GB'],
          ['cause', 'S3 copy via NAT'],
          ['fix', 'S3 gateway endpoint'],
        ],
      },
      {
        id: 'budget',
        kind: 'list',
        icon: 'budgets',
        label: 'shop-prod-monthly',
        pattern: 'external',
        items: [
          '400 USD, env=prod only',
          'Email at 80% of forecast',
          'A budget warns; it never stops',
          'Untagged 2%: no owner yet',
        ],
      },
    ],
  },
)
