import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { decoupleTree } from './tree'
import code from '../../../spine/decouple/04-queue/project/tools/consumer.py?raw'
import session from '../../../spine/decouple/04-queue/session.txt?raw'

// SQS: a received message is hidden for the visibility timeout and reappears unless deleted;
// long polling (WaitTimeSeconds up to 20) waits for messages; standard queues are at-least-once
// with best-effort order, FIFO queues exactly-once processing within a deduplication interval,
// ordered per message group, with lower throughput.
// source: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-visibility-timeout.html
// source: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-short-and-long-polling.html
// source: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-queue-types.html
export const queue: Scene = ideFrame(
  'queue-consumer',
  'shop-on-aws',
  decoupleTree('04', 'tools/consumer.py', ['tools/consumer.py']),
  { file: 'tools/consumer.py', code, show: [[18, 33]], highlight: [18, 21, 23, 26, 28, 31], terminal: session },
  {
    id: 'queue-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'queue-kinds',
        kind: 'table',
        label: 'Standard or FIFO',
        headers: ['', 'standard', 'FIFO'],
        values: [
          ['delivery', 'at least once', 'exactly once'],
          ['order', 'best effort', 'per group'],
          ['throughput', 'nearly unlimited', 'limited'],
          ['fulfilment', 'yes', 'not needed'],
        ],
      },
      {
        id: 'queue-rules',
        kind: 'list',
        icon: 'sqs',
        label: 'Receive, work, delete',
        pattern: 'network',
        items: [
          'Received is hidden, not removed',
          'No delete: it comes back',
          'Timeout longer than the work',
          'The checkout no longer waits',
        ],
      },
    ],
  },
)
