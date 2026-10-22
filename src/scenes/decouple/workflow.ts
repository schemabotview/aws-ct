import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { decoupleTree } from './tree'
import code from '../../../spine/decouple/07-workflow/project/workflows/place-order.asl.json?raw'
import session from '../../../spine/decouple/07-workflow/session.txt?raw'

// Step Functions (Amazon States Language): Task states call services (lambda:invoke here); Retry
// matches error names with IntervalSeconds × BackoffRate^n for MaxAttempts; Catch routes remaining
// errors to a recovery state (compensation); Fail ends the execution as failed. moto stores the
// state machine but cannot run Lambda tasks, so tools/run_workflow.py walks the same definition
// with stand-in task results (labelled on screen).
// source: https://docs.aws.amazon.com/step-functions/latest/dg/concepts-error-handling.html
// source: https://docs.aws.amazon.com/step-functions/latest/dg/connect-lambda.html
export const workflow: Scene = ideFrame(
  'order-workflow',
  'shop-on-aws',
  decoupleTree('07', 'workflows/place-order.asl.json', ['workflows', 'infra/10-workflow.sh', 'policies/order-workflow-trust.json', 'tools/run_workflow.py']),
  { file: 'workflows/place-order.asl.json', code, show: [[5, 20]], highlight: [7, 9, 15, 16, 17, 18], terminal: session },
  {
    id: 'workflow-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'states',
        kind: 'table',
        label: 'The five states',
        headers: ['state', 'on success', 'on error'],
        values: [
          ['ReserveStock', 'ChargePayment', 'fails'],
          ['ChargePayment', 'ShipOrder', 'retry, then catch'],
          ['ShipOrder', 'end', 'fails'],
          ['ReleaseStock', 'OrderFailed', 'fails'],
          ['OrderFailed', '—', 'Fail'],
        ],
      },
      {
        id: 'workflow-rules',
        kind: 'list',
        icon: 'stepfunctions',
        label: 'State outside the code',
        pattern: 'service',
        items: [
          'Retry: a timeout, 2 s then 4 s',
          'Catch: undo what was done',
          'Each step a small function',
          'Task results here: stand-ins',
        ],
      },
    ],
  },
)
