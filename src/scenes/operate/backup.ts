import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { operateTree } from './tree'
import code from '../../../spine/operate/08-backup/project/ops/restore_drill.py?raw'
import session from '../../../spine/operate/08-backup/session.txt?raw'

// AWS Backup: plans (schedule, lifecycle), vaults, and copy actions to a vault in another account
// and Region (cross-account copy requires an organization); restore testing can automate drills.
// RDS PITR restores to a new instance at any second in the retention window. The drill times are
// the shop's example log; moto stores the plan and vault but runs no backups (no selections).
// source: https://docs.aws.amazon.com/aws-backup/latest/devguide/creating-a-backup-plan.html
// source: https://docs.aws.amazon.com/aws-backup/latest/devguide/create-cross-account-backup.html
// source: https://docs.aws.amazon.com/aws-backup/latest/devguide/restore-testing.html
export const backup: Scene = ideFrame(
  'backup-and-restore',
  'shop-on-aws',
  operateTree('08', 'ops/restore_drill.py', ['ops/restore_drill.py', 'infra/12-backup.sh', 'infra/backup']),
  { file: 'ops/restore_drill.py', code, show: [[3, 8], [16, 22]], highlight: [3, 5, 8, 18, 19, 21], terminal: session },
  {
    id: 'backup-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'plan',
        kind: 'table',
        label: 'Plan shop-daily',
        headers: ['', 'value'],
        values: [
          ['when', '02:00 UTC, daily'],
          ['kept', '35 days, prod vault'],
          ['copied to', 'audit, eu-west-1'],
          ['copy kept', '90 days'],
        ],
      },
      {
        id: 'restore-rules',
        kind: 'list',
        icon: 'backup',
        label: 'A backup is a restore',
        pattern: 'storage',
        items: [
          'Untested, it is a hope',
          'Time it; compare with the RTO',
          'Check the data, not just the boot',
          'A copy prod cannot delete',
        ],
      },
    ],
  },
)
