import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { startTree } from './tree'
import code from '../../../spine/start/06-cleanup/project/tools/cost_ledger.py?raw'
import session from '../../../spine/start/06-cleanup/session.txt?raw'

// A budget sends alerts when actual or forecast cost crosses a threshold; on its own it does not stop
// spending (budget actions can apply a policy or stop some instances, if configured).
// source: https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html
// source: https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-controls.html
export const cleanup: Scene = ideFrame(
  'cleanup',
  'shop-on-aws',
  startTree('06', 'tools/cost_ledger.py', ['tools/cost_ledger.py', 'infra/teardown.sh']),
  { file: 'tools/cost_ledger.py', code, highlight: [2, 3, 5, 16], terminal: session },
  {
    id: 'cleanup-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'teardown',
        kind: 'table',
        label: 'infra/teardown.sh, newest first',
        headers: ['step', 'why'],
        values: [
          ['aws s3 rm --recursive', 'a bucket must be empty'],
          ['delete-bucket', 'then it can go'],
          ['list-buckets', 'check: nothing left'],
        ],
      },
      {
        id: 'budget',
        kind: 'list',
        icon: 'bell',
        label: 'A budget is an alarm, not a cap',
        pattern: 'external',
        items: [
          'It emails when cost or forecast crosses a line',
          'It stops nothing unless you add an action',
          'Tags (app, env, owner) say whose cost it is',
          'Cleanup is a script, kept beside what it removes',
        ],
      },
    ],
  },
)
