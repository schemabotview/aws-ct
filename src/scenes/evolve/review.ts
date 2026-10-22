import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { evolveTree } from './tree'
import code from '../../../spine/evolve/11-review/project/evolve/priorities.py?raw'
import session from '../../../spine/evolve/11-review/session.txt?raw'

// The AWS Well-Architected Framework's six pillars (operational excellence, security, reliability,
// performance efficiency, cost optimisation, sustainability); a review records evidence per pillar
// and an improvement plan prioritised by risk. Value and effort are the review's own estimates.
// source: https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html
// source: https://docs.aws.amazon.com/wellarchitected/latest/userguide/workloads.html
export const review: Scene = ideFrame(
  'well-architected-review',
  'shop-on-aws',
  evolveTree('11', 'evolve/priorities.py', ['evolve/priorities.py']),
  { file: 'evolve/priorities.py', code, highlight: [4, 5, 7, 11, 15, 16], terminal: session, emulated: false },
  {
    id: 'review-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'pillars',
        kind: 'table',
        label: 'Six pillars, the evidence',
        headers: ['pillar', 'evidence'],
        values: [
          ['operational', 'alarms, runbook'],
          ['security', 'roles, keys, trail'],
          ['reliability', 'Multi-AZ, drill'],
          ['performance', 'p99, the knee'],
          ['cost', 'tags, budget'],
          ['sustainability', 'busy, retained'],
        ],
      },
      {
        id: 'review-rules',
        kind: 'list',
        icon: 'circlecheck',
        label: 'A review is a plan',
        pattern: 'service',
        items: [
          'Evidence, not opinions',
          'Value for effort: fix first',
          'Active/active: last, on purpose',
        ],
      },
    ],
  },
)
