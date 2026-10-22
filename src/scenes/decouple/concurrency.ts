import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { decoupleTree } from './tree'
import code from '../../../spine/decouple/03-concurrency/project/policies/place-order-fn.json?raw'
import session from '../../../spine/decouple/03-concurrency/session.txt?raw'

// The execution role is what the function's code runs as. Reserved concurrency both guarantees and
// caps a function's concurrent executions; above it, synchronous invocations are throttled (429
// through API Gateway). The account's default concurrency quota is 1,000 per Region.
// AWSLambdaBasicExecutionRole grants CloudWatch Logs writes. 0.12 s is assumed (CLAUDE.md).
// source: https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html
// source: https://docs.aws.amazon.com/lambda/latest/dg/configuration-concurrency.html
// source: https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html
export const concurrency: Scene = ideFrame(
  'concurrency-limits',
  'shop-on-aws',
  decoupleTree('03', 'policies/place-order-fn.json', ['policies/place-order-fn.json', 'tools/concurrency.py']),
  { file: 'policies/place-order-fn.json', code, highlight: [7, 9, 10], terminal: session },
  {
    id: 'concurrency-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'littles-law',
        kind: 'table',
        label: 'The evening peak',
        headers: ['quantity', 'value'],
        values: [
          ['requests', '560 a second'],
          ['each takes', '0.12 s, assumed'],
          ['in flight', '560 × 0.12 = 67'],
          ['reserved', '50 → 417 a second'],
          ['throttled', '143 a second'],
        ],
      },
      {
        id: 'reserve-why',
        kind: 'list',
        icon: 'gauge',
        label: 'Why cap it at all',
        pattern: 'warn',
        items: [
          'A ceiling for what is behind it',
          'A guarantee: 50 always free',
          'Too low: raise it, or queue (§4)',
          'Role: two tables, plus its logs',
        ],
      },
    ],
  },
)
