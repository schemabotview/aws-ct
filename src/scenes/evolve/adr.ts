import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { evolveTree } from './tree'
import code from '../../../spine/evolve/07-adr/project/decisions/ADR-007.md?raw'
import session from '../../../spine/evolve/07-adr/session.txt?raw'

// An architecture decision record captures context, options, decision and consequences; musts
// (constraints) eliminate options before wants (weighted) rank them. ADR-007 and its scores are the
// shop's own judgement, written down so they can be revisited.
// source: https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/welcome.html
export const adr: Scene = ideFrame(
  'decision-record',
  'shop-on-aws',
  evolveTree('07', 'decisions/ADR-007.md', ['decisions', 'evolve/score_options.py']),
  { file: 'decisions/ADR-007.md', code, show: [[4, 20]], highlight: [6, 12, 13, 16], terminal: session, emulated: false },
  {
    id: 'adr-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'requirements',
        kind: 'table',
        label: 'The requirement set',
        headers: ['requirement', 'kind'],
        values: [
          ['PostgreSQL transactions', 'must'],
          ['the team can run it', 'must'],
          ['no OS patching', 'want ×3'],
          ['cost at today’s load', 'want ×2'],
          ['5× peak headroom', 'want ×2'],
        ],
      },
      {
        id: 'adr-rules',
        kind: 'list',
        icon: 'scroll',
        label: 'Why write it down',
        pattern: 'group',
        items: [
          'Musts first: they reject',
          'Wants rank what is left',
          'Revisit at 5× the peak',
        ],
      },
    ],
  },
)
