import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { filesTree } from './tree'
import code from '../../../spine/files/07-encryption/project/templates/storage.yaml?raw'
import session from '../../../spine/files/07-encryption/session.txt?raw'

// SSE-KMS encrypts objects under a KMS key; a bucket key reduces KMS requests (and their cost) by
// using a short-lived bucket-level key. The key policy decides who may use the key. Encryption at
// rest, versioning, replication, Object Lock and backups each protect against different things.
// source: https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingKMSEncryption.html
// source: https://docs.aws.amazon.com/AmazonS3/latest/userguide/bucket-key.html
// source: https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication.html
// source: https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html
export const protection: Scene = ideFrame(
  'data-protection',
  'shop-on-aws',
  filesTree('07', 'templates/storage.yaml', ['infra/s3/reports-encryption.json']),
  { file: 'templates/storage.yaml', code, show: [[30, 45]], highlight: [31, 34, 38, 40, 41], terminal: session },
  {
    id: 'protection-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'threats',
        kind: 'table',
        label: 'Which protects against what',
        headers: ['threat', 'protection'],
        values: [
          ['a stolen disk', 'encryption at rest'],
          ['the wrong reader', 'key and bucket policy'],
          ['a mistaken delete', 'versioning'],
          ['a lost Region', 'replication'],
          ['a deleted account', 'backup elsewhere'],
          ['deliberate wiping', 'Object Lock'],
        ],
      },
      {
        id: 'kms-notes',
        kind: 'list',
        icon: 'kms',
        label: 'The reports key',
        pattern: 'warn',
        items: [
          'Rotated every year, automatically',
          'Bucket key: far fewer KMS calls',
          'Course 12 gives the Auditor Decrypt',
        ],
      },
    ],
  },
)
