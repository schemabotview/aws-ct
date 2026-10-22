import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { reportTree } from './tree'
import code from '../../../spine/report/06-stream/project/analytics/consumer_lag.py?raw'
import session from '../../../spine/report/06-stream/session.txt?raw'

// Kinesis Data Streams: a provisioned shard takes 1 MB/s or 1,000 records/s in and 2 MB/s out;
// the partition key's MD5 hash picks the shard, and order holds within a shard; default retention
// is 24 hours (up to 365 days); GetRecords.IteratorAgeMilliseconds measures how far a consumer
// lags. The lag is a model (labelled); the stream and shard assignment are moto's.
// source: https://docs.aws.amazon.com/streams/latest/dev/service-sizes-and-limits.html
// source: https://docs.aws.amazon.com/streams/latest/dev/key-concepts.html
// source: https://docs.aws.amazon.com/streams/latest/dev/monitoring-with-cloudwatch.html
export const stream: Scene = ideFrame(
  'stream-lag',
  'shop-on-aws',
  reportTree('06', 'analytics/consumer_lag.py', ['analytics/consumer_lag.py', 'infra/11-stream.sh']),
  { file: 'analytics/consumer_lag.py', code, show: [[7, 22]], highlight: [8, 10, 11, 19], terminal: session },
  {
    id: 'stream-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'shards',
        kind: 'table',
        label: 'shop-clickstream, 2 shards',
        headers: ['', 'value'],
        values: [
          ['in, per shard', '1,000 records/s'],
          ['order', 'within a shard'],
          ['same key', 'same shard'],
          ['kept for', '24 h by default'],
        ],
      },
      {
        id: 'lag-rules',
        kind: 'list',
        icon: 'kinesis',
        label: 'Falling behind, safely',
        pattern: 'network',
        items: [
          '1,800 in, 1,600 read: lag grows',
          'Alarm on iterator age',
          'Lag past retention is data lost',
          'Fix: more shards, more readers',
        ],
      },
    ],
  },
)
