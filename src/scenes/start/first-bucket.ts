import type { Scene } from '@graphlearning/flow'
import { mapFrame } from '../map'
import code from '../../../spine/start/05-first-bucket/project/infra/01-bucket.sh?raw'
import session from '../../../spine/start/05-first-bucket/session.txt?raw'

// Outside us-east-1, CreateBucket on a bucket you already own fails with BucketAlreadyOwnedByYou.
// source: https://docs.aws.amazon.com/AmazonS3/latest/API/API_CreateBucket.html
export const firstBucket: Scene = mapFrame('first-bucket', ['shopper', 'buckets'], {
  id: 'first-bucket-pane',
  label: 'side',
  bare: true,
  children: [
    { id: 'bucket-script', kind: 'code', filename: 'infra/01-bucket.sh', label: code.replace(/\n+$/, ''), highlight: [5, 6, 8, 9, 11, 12, 13] },
    { id: 'bucket-run', kind: 'terminal', filename: 'Terminal — shop-on-aws · emulated', label: session.replace(/\n+$/, '') },
    {
      id: 'second-run',
      kind: 'list',
      icon: 'repeat',
      label: 'Run it twice',
      pattern: 'warn',
      items: [
        'The bucket exists, so CreateBucket fails, and set -e stops the script',
        'A script records what to do, not what should exist — Course 7 fixes that',
      ],
    },
  ],
})
