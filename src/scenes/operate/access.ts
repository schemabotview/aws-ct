import type { Scene } from '@graphlearning/flow'
import { BUILT_BY, mapFrame } from '../map'
import code from '../../../spine/operate/04-ops/project/infra/12-ops.sh?raw'
import session from '../../../spine/operate/04-ops/session.txt?raw'

// Systems Manager: Session Manager for shell access without SSH or bastions (logged), Patch Manager
// with patch baselines and patch groups, Inventory. AWS Config records resource configuration and
// evaluates rules (S3_BUCKET_PUBLIC_READ_PROHIBITED is an AWS managed rule). moto stores the
// baseline and rule but cannot read the patch group back or evaluate compliance.
// source: https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager.html
// source: https://docs.aws.amazon.com/config/latest/developerguide/s3-bucket-public-read-prohibited.html
// source: https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html
export const access: Scene = mapFrame('ops-access', [...BUILT_BY[11], 'watch', 'trail'], {
  id: 'access-pane',
  label: 'side',
  bare: true,
  children: [
    { id: 'ops-sh', kind: 'code', filename: 'infra/12-ops.sh', label: code.replace(/\n+$/, ''), show: [[5, 17]], highlight: [5, 6, 8, 9, 10, 16, 17] },
    { id: 'ops-run', kind: 'terminal', filename: 'Terminal — shop-on-aws · emulated', label: session.replace(/\n+$/, '') },
    {
      id: 'ops-questions',
      kind: 'table',
      label: 'Operating a fleet without logging in to it',
      headers: ['question', 'answered by'],
      values: [
        ['how do I get a shell on app-2?', 'Session Manager: no SSH, every session logged'],
        ['are the servers patched?', 'Patch Manager: baseline + patch group order-api'],
        ['what is installed where?', 'Systems Manager Inventory'],
        ['is any bucket public?', 'Config rule s3-no-public-read'],
      ],
    },
  ],
})
