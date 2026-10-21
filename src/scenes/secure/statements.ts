import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { secureTree } from './tree'
import code from '../../../spine/secure/05-policy/project/policies/order-api-access.json?raw'
import session from '../../../spine/secure/05-policy/session.txt?raw'

// The parts of a policy statement: Sid, Effect, Action, Resource, Condition. s3:ListBucket acts on
// the bucket ARN, s3:GetObject on object ARNs; s3:prefix limits which keys a listing may ask for.
// source: https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_elements.html
// source: https://docs.aws.amazon.com/AmazonS3/latest/userguide/amazon-s3-policy-keys.html
export const statements: Scene = ideFrame(
  'policy-statements',
  'shop-on-aws',
  secureTree('05', 'policies/order-api-access.json', ['policies/order-api-access.json']),
  { file: 'policies/order-api-access.json', code, highlight: [6, 7, 8], terminal: session },
  {
    id: 'statements-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'four',
        kind: 'table',
        label: 'Each statement, four answers',
        headers: ['element', 'answers'],
        values: [
          ['Effect', 'allow or deny?'],
          ['Action', 'which API calls?'],
          ['Resource', 'on which ARNs?'],
          ['Condition', 'only when?'],
        ],
      },
      {
        id: 'least',
        kind: 'list',
        icon: 'key',
        label: 'Least privilege, line by line',
        pattern: 'user',
        items: [
          'Read products, never write them',
          'List the bucket, but only under products/',
          'Send to one queue, not receive from it',
          'ListBucket names the bucket; GetObject names objects',
        ],
      },
    ],
  },
)
