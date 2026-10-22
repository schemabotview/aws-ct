import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { ordersTree } from './tree'
import code from '../../../spine/orders/08-cache/project/tools/cache_aside.py?raw'
import session from '../../../spine/orders/08-cache/session.txt?raw'

// Cache-aside (lazy loading): read the cache, on a miss read the database and populate the cache;
// a TTL bounds staleness, and deleting the key on write removes it for the common case.
// ElastiCache (Valkey, Redis OSS, Memcached) is the managed cache; the script models the pattern
// in plain Python, no AWS service involved.
// source: https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html
export const cache: Scene = ideFrame(
  'cache-aside',
  'shop-on-aws',
  ordersTree('08', 'tools/cache_aside.py', ['tools/cache_aside.py']),
  { file: 'tools/cache_aside.py', code, show: [[10, 24]], highlight: [12, 13, 14, 19, 20], terminal: session, emulated: false },
  {
    id: 'cache-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'cache-timeline',
        kind: 'table',
        label: 'Price drops to 10.0 at t=10',
        headers: ['strategy', 'stale for'],
        values: [
          ['TTL only, 60 s', '10 s → 60 s'],
          ['delete on write', 'none here'],
          ['no cache', 'none, every read to DB'],
        ],
      },
      {
        id: 'cache-rules',
        kind: 'list',
        icon: 'elasticache',
        label: 'A cache is a copy',
        pattern: 'network',
        items: [
          'The TTL is the worst-case staleness',
          'Delete on write; keep the TTL too',
          'Never cache the stock count',
          'Managed: ElastiCache, Valkey',
        ],
      },
    ],
  },
)
