import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { filesTree } from './tree'
import code from '../../../spine/files/04-two-writers/project/tools/two_writers.py?raw'
import session from '../../../spine/files/04-two-writers/session.txt?raw'

// S3 is strongly consistent for reads after writes, but there are no multi-request transactions;
// concurrent PUTs to one key end with the last writer's object. Conditional writes (If-Match on an
// ETag, If-None-Match: *) refuse a write when the object changed: 412 PreconditionFailed.
// source: https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel
// source: https://docs.aws.amazon.com/AmazonS3/latest/userguide/conditional-writes.html
export const writers: Scene = ideFrame(
  'concurrent-writers',
  'shop-on-aws',
  filesTree('04', 'tools/two_writers.py', ['tools/two_writers.py']),
  { file: 'tools/two_writers.py', code, show: [[23, 39]], highlight: [24, 26, 29, 30, 31], terminal: session },
  {
    id: 'writers-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'timeline',
        kind: 'table',
        label: 'The plain race',
        headers: ['step', 'object'],
        values: [
          ['both read', 'price 12.0, stock 40'],
          ['price job writes', 'price 10.0, stock 40'],
          ['stock job writes', 'price 12.0, stock 39'],
          ['lost', 'the new price'],
        ],
      },
      {
        id: 'consistency',
        kind: 'list',
        icon: 'swap',
        label: 'Strong, but not a transaction',
        pattern: 'storage',
        items: [
          'A read after a write sees that write',
          'Two writes to one key: the last one wins',
          'If-Match: write only if unchanged',
          'Several keys at once: Course 9’s databases',
        ],
      },
    ],
  },
)
