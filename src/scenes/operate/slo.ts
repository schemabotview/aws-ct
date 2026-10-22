import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { operateTree } from './tree'
import code from '../../../spine/operate/02-alarm/project/ops/error_budget.py?raw'
import session from '../../../spine/operate/02-alarm/session.txt?raw'

// An SLO and its error budget; burn rate = observed error rate / allowed error rate; alerting on a
// fast burn (≈14×) sustained over a short window pages, a slow burn tickets. CloudWatch alarms:
// period, evaluation periods, datapoints-to-alarm (M of N), treat-missing-data, SNS actions.
// source: https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html
// source: https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/CloudWatch-ServiceLevelObjectives.html
export const slo: Scene = ideFrame(
  'slos-and-alarms',
  'shop-on-aws',
  operateTree('02', 'ops/error_budget.py', ['ops', 'infra/12-alarm.sh']),
  { file: 'ops/error_budget.py', code, highlight: [2, 3, 6, 10, 15], terminal: session },
  {
    id: 'slo-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'objective',
        kind: 'table',
        label: 'Checkout, 30 days',
        headers: ['', 'value'],
        values: [
          ['objective', '99.9% succeed'],
          ['requests', '15,552,000'],
          ['may fail', '15,552'],
          ['2% failing', 'gone in 36 h'],
        ],
      },
      {
        id: 'alarm-rules',
        kind: 'list',
        icon: 'bell',
        label: 'checkout-5xx-fast-burn',
        pattern: 'warn',
        items: [
          'Over 5 a minute, 5 of 5 minutes',
          'Pages ops-pager, a person',
          'Slow burns: a ticket, not a page',
          'No data is not breaching',
        ],
      },
    ],
  },
)
