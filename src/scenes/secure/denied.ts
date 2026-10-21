import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { secureTree } from './tree'
import code from '../../../spine/secure/06-denied/project/policies/order-api-access.json?raw'
import session from '../../../spine/secure/06-denied/session.txt?raw'

// Same-account evaluation: an explicit Deny in any applicable policy wins; otherwise an Allow is
// needed; with neither, the request is implicitly denied. The probe runs with moto's IAM
// enforcement on (spine/secure/06-denied: credentials assumed before enforcement, as the instance
// profile would deliver them). moto does not evaluate the s3:prefix condition, so the listing case
// is left out of the probe and stated from the documentation.
// source: https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html
export const denied: Scene = ideFrame(
  'denied',
  'shop-on-aws',
  secureTree('06', 'policies/order-api-access.json', ['tools/probe.py']),
  { file: 'policies/order-api-access.json', code, highlight: [11, 12], pattern: 'warn', terminal: session },
  {
    id: 'denied-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'why',
        kind: 'table',
        label: 'Why each answer',
        headers: ['request', 'decided by'],
        values: [
          ['products/p-1001', 'Allow: ReadProducts'],
          ['products/drafts/…', 'explicit Deny wins'],
          ['orders/o-501', 'no Allow: implicit'],
          ['overwrite', 'no Allow: implicit'],
          ['order-events', 'Allow: SendOrderEvents'],
        ],
      },
      {
        id: 'order',
        kind: 'list',
        icon: 'scale',
        label: 'The order of evaluation',
        pattern: 'warn',
        items: [
          'Start from deny: nothing is allowed by default',
          'Any explicit Deny ends it, whatever else allows',
          'Otherwise an Allow is needed, or it stays denied',
          'Listing orders/ is denied too, by ListProducts’ condition: the emulator skips conditions, AWS does not',
        ],
      },
    ],
  },
)
