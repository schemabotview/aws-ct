import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { operateTree } from './tree'
import code from '../../../spine/operate/10-quotas/project/ops/backoff_jitter.py?raw'
import session from '../../../spine/operate/10-quotas/session.txt?raw'

// Service Quotas lists default and applied quotas, adjustable or not; API throttling returns
// ThrottlingException / 429; AWS SDKs retry with exponential backoff and jitter; AWS Fault
// Injection Service runs controlled failure experiments. moto implements only VPC quotas, so the
// listing is VPC's; the retry comparison is a model.
// source: https://docs.aws.amazon.com/servicequotas/latest/userguide/intro.html
// source: https://docs.aws.amazon.com/sdkref/latest/guide/feature-retry-behavior.html
// source: https://docs.aws.amazon.com/fis/latest/userguide/what-is.html
export const quotas: Scene = ideFrame(
  'quotas-and-resilience',
  'shop-on-aws',
  operateTree('10', 'ops/backoff_jitter.py', ['ops/backoff_jitter.py']),
  { file: 'ops/backoff_jitter.py', code, show: [[9, 24]], highlight: [14, 17, 19, 21, 22], terminal: session },
  {
    id: 'quotas-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'limits',
        kind: 'table',
        label: 'Two kinds of limit',
        headers: ['kind', 'what to do'],
        values: [
          ['adjustable quota', 'request more, early'],
          ['fixed limit', 'design around it'],
          ['API rate limit', 'back off, jitter'],
        ],
      },
      {
        id: 'resilience',
        kind: 'list',
        icon: 'zap',
        label: 'Testing the failures',
        pattern: 'warn',
        items: [
          'In step, retries collide again',
          'Jitter spreads them out',
          'Fault Injection: break it on purpose',
          'Watch quotas before peak',
        ],
      },
    ],
  },
)
