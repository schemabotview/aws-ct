import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { secureTree } from './tree'
import code from '../../../spine/secure/07-cross-account/project/policies/reports-bucket.json?raw'
import session from '../../../spine/secure/07-cross-account/session.txt?raw'

// Within one account, an Allow in EITHER the identity policy or the resource policy is enough.
// Across accounts, BOTH must allow: the bucket policy in production names the Auditor role, and the
// Auditor's own identity policy in the audit account allows the same reads (auditor-reads.json).
// The emulator does not model cross-account evaluation, so this is the documentation's rule.
// source: https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic-cross-account.html
// source: https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-policy-language-overview.html
export const crossAccount: Scene = ideFrame(
  'cross-account',
  'shop-on-aws',
  secureTree('07', 'policies/reports-bucket.json', ['policies/reports-bucket.json', 'policies/auditor-reads.json']),
  { file: 'policies/reports-bucket.json', code, highlight: [7, 8], terminal: session },
  {
    id: 'cross-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'who-allows',
        kind: 'table',
        label: 'Which policies must allow',
        headers: ['caller', 'needs'],
        values: [
          ['same account', 'identity OR resource'],
          ['another account', 'identity AND resource'],
        ],
      },
      {
        id: 'auditor',
        kind: 'list',
        icon: 'search',
        label: 'The Auditor’s read, from 777788889999',
        pattern: 'network',
        items: [
          'Bucket policy here: names the Auditor role',
          'auditor-reads.json there: allows the same reads',
          'Remove either one, and the read is denied',
          'Not public: the principal is one role, not *',
        ],
      },
    ],
  },
)
