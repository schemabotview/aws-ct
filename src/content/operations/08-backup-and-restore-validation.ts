import type { Section } from '../types'

export const backupAndRestoreValidation: Section = {
  id: 'backup-and-restore-validation',
  title: 'Backup policies, isolated recovery copies, and restore validation',
  scene: 'backup-and-restore',
  focus: 'drill-out',
  slide: `## Backups and restore drills

**Objective:** judge a backup by a timed, checked restore.

### Mental model
- **Backup plan**: schedule, retention, and copies
- **Isolated copy**: another account and Region than production
- **Restore drill**: timed checkpoints against RTO and RPO

### Worked example: shop-daily
- Daily at 02:00 UTC, kept 35 days in shop-prod-vault
- Copy to the audit account's vault in eu-west-1, kept 90 days
- Drill: 66 min to recover, RTO 90 min → met
- Restored to 01:52: 8 min of data lost, RPO 15 min → met

### Misconception
- "We have backups" — only a performed restore shows recovery

### Explanation summary
- Isolate the copies, rehearse the restore, time every step`,
  narration:
    "High availability keeps the shop running when hardware fails. It does not help when data is deleted or corrupted, because the standby faithfully copies the mistake. That is what backups are for, and the question to ask of them is whether a restore has actually been done. The card at the top is an A W S Backup plan, validated in full against the service model. Rule daily thirty five d runs every day at two in the morning U T C, keeps each recovery point in the vault shop-prod-vault for thirty five days, and copies it to a vault called shop-isolated in the audit account, seven seven seven seven, eight eight eight eight, nine nine nine nine, in E U west one, where it is kept for ninety days. The copy is isolated: someone who compromises production, or a mistake that deletes production's recovery points, cannot reach it. A vault lock can also make recovery points undeletable for their retention. The program below scores a restore drill against two targets. The recovery time objective, R T O, is ninety minutes; the recovery point objective, R P O, is fifteen minutes. The timestamps are illustrative; the arithmetic runs. Incident declared at two o'clock, point in time restore to one fifty two started at two oh nine, instance available at two forty one, row counts and last orders checked by two fifty eight, and the app switched over at three oh six. Recovered in sixty six minutes, so the R T O was met, and eight minutes of data lost, so the R P O was met. The misconception is that having backups means being able to recover. Only a performed, timed, checked restore shows that. So: isolate the copies, rehearse the restore, and time every step.",
}
