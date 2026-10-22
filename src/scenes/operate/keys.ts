import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { operateTree } from './tree'
import code from '../../../spine/operate/05-keys/project/policies/reports-key.json?raw'
import session from '../../../spine/operate/05-keys/session.txt?raw'

// A KMS key policy is the primary control of a key; the account-root statement delegates to IAM;
// kms:ViaService limits use to requests made through a service; encryption context is additional
// authenticated data that must match on decrypt; automatic rotation of a customer managed key is
// yearly by default. Secrets Manager rotation moves AWSCURRENT to a new version; clients that cache
// the value must re-read on authentication failure. The database in ops/rotation.py is a stand-in.
// source: https://docs.aws.amazon.com/kms/latest/developerguide/key-policy-default.html
// source: https://docs.aws.amazon.com/kms/latest/developerguide/encrypt_context.html
// source: https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html
export const keys: Scene = ideFrame(
  'keys-and-rotation',
  'shop-on-aws',
  operateTree('05', 'policies/reports-key.json', ['policies/reports-key.json', 'infra/12-keys.sh', 'ops/rotation.py']),
  { file: 'policies/reports-key.json', code, show: [[5, 20]], highlight: [7, 8, 13, 14, 17], terminal: session },
  {
    id: 'keys-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'key-facts',
        kind: 'table',
        label: 'alias/shop-reports',
        headers: ['', 'value'],
        values: [
          ['administers', 'the prod account'],
          ['Auditor', 'Decrypt, via S3 only'],
          ['rotation', 'yearly, automatic'],
          ['context', 'must match to decrypt'],
        ],
      },
      {
        id: 'rotation-lesson',
        kind: 'list',
        icon: 'key',
        label: 'The rotation at 09:30',
        pattern: 'warn',
        items: [
          'Cached pw-v1 stops working',
          'Re-read the secret on auth failure',
          'Or rotate with two users, alternating',
          'The database here is a stand-in',
        ],
      },
    ],
  },
)
