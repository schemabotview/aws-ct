import type { Scene } from '@graphlearning/flow'
import { BUILT_BY, mapFrame } from '../map'
import code from '../../../spine/files/02-catalog-bucket/project/templates/storage.yaml?raw'
import session from '../../../spine/files/02-catalog-bucket/session.txt?raw'

// S3 keys are flat names; "/" is a convention that prefixes and the console show as folders. A
// bucket policy can deny any request not made over TLS (aws:SecureTransport). Block Public Access
// overrides policies and ACLs that would make the bucket public.
// source: https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-keys.html
// source: https://docs.aws.amazon.com/AmazonS3/latest/userguide/security-best-practices.html
// source: https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html
export const catalog: Scene = mapFrame('catalog-bucket', BUILT_BY[7], {
  id: 'catalog-pane',
  label: 'side',
  bare: true,
  children: [
    { id: 'storage-yaml', kind: 'code', filename: 'templates/storage.yaml', label: code.replace(/\n+$/, ''), show: [[13, 25]], highlight: [19, 20, 21, 25] },
    { id: 'catalog-run', kind: 'terminal', filename: 'Terminal — shop-on-aws · emulated', label: session.replace(/\n+$/, '') },
    {
      id: 'key-names',
      kind: 'list',
      icon: 's3',
      label: 'How S3 names things',
      pattern: 'storage',
      items: [
        'A key is a flat name: products/p-1001.json has no folder, only a prefix',
        'PUT replaces a whole object; there is no editing part of one',
        'Every bucket blocks public access; the policy refuses plain HTTP',
      ],
    },
  ],
})
