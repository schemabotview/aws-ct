import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { decoupleTree } from './tree'
import code from '../../../spine/decouple/08-once/project/workers/ship_once.py?raw'
import session from '../../../spine/decouple/08-once/session.txt?raw'

// Standard queues deliver at least once, so consumers must be idempotent; a redrive policy moves a
// message to the dead-letter queue after maxReceiveCount receives; DLQ redrive moves messages back
// for replay; an SQS event source mapping can report batchItemFailures so only failed messages
// return; AWS recommends exponential backoff with jitter for retries.
// source: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html
// source: https://docs.aws.amazon.com/lambda/latest/dg/services-sqs-errorhandling.html
// source: https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/retry-backoff.html
export const once: Scene = ideFrame(
  'idempotency',
  'shop-on-aws',
  decoupleTree('08', 'workers/ship_once.py', ['workers']),
  { file: 'workers/ship_once.py', code, show: [[16, 26], [34, 37]], highlight: [16, 17, 18, 20, 25, 36], terminal: session },
  {
    id: 'once-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'retry-owner',
        kind: 'table',
        label: 'Who retries, and what stops it',
        headers: ['failure', 'what happens'],
        values: [
          ['a duplicate delivery', 'the key: skipped'],
          ['a message that never works', 'DLQ after 3; replay'],
          ['one bad in a batch of ten', 'report only it'],
          ['a busy service', 'back off, jitter'],
        ],
      },
      {
        id: 'once-rules',
        kind: 'list',
        icon: 'repeat',
        label: 'Safe to do twice',
        pattern: 'warn',
        items: [
          'Claim a key before the side effect',
          'Watch the DLQ; it is a to-do list',
        ],
      },
    ],
  },
)
