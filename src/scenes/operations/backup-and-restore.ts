import type { Scene } from '@graphlearning/flow'

// §10.8 — a backup plan with an ISOLATED copy (another account, another Region: the audit account's
// vault in eu-west-1), validated in full, and a restore drill with timed checkpoints. The drill's
// timestamps are illustrative; the arithmetic against the targets runs. Only a performed restore is
// evidence of recoverability.
// source: https://docs.aws.amazon.com/aws-backup/latest/devguide/create-a-scheduled-backup.html
// source: https://docs.aws.amazon.com/aws-backup/latest/devguide/vault-lock.html
export const backupAndRestore: Scene = {
  id: 'backup-and-restore',
  title: 'A backup is a restore you have rehearsed',
  flow: 'TB',
  padding: 0.05,
  nodes: [
    {
      id: 'plan',
      kind: 'code',
      filename: 'backup.CreateBackupPlan.request.json · model-checked',
      hug: true,
      label: `{
  "BackupPlan": {
    "BackupPlanName": "shop-daily",
    "Rules": [{
      "RuleName": "daily-35d",
      "TargetBackupVaultName": "shop-prod-vault",
      "ScheduleExpression": "cron(0 2 * * ? *)",
      "Lifecycle": { "DeleteAfterDays": 35 },
      "CopyActions": [{
        "DestinationBackupVaultArn":
          "arn:aws:backup:eu-west-1:777788889999:backup-vault:shop-isolated",
        "Lifecycle": { "DeleteAfterDays": 90 }
      }]
    }]
  }
}`,
    },
    {
      id: 'drill',
      kind: 'code',
      filename: 'restore_drill.py · runs locally',
      hug: true,
      label: `from datetime import datetime

# checkpoints from a quarterly restore drill (illustrative log values)
log = [
    ("incident declared", "02:00"),
    ("restore started (PITR to 01:52)", "02:09"),
    ("instance available", "02:41"),
    ("checks passed: row counts, last orders", "02:58"),
    ("app switched to restored DB", "03:06"),
]
RTO_MIN, RPO_MIN = 90, 15
t = [datetime.strptime(at, "%H:%M") for _, at in log]
for (step, at), prev in zip(log, [t[0]] + t[:-1]):
    took = (datetime.strptime(at, "%H:%M") - prev).seconds // 60
    print(f"{at}  +{took:>2} min  {step}")
total = (t[-1] - t[0]).seconds // 60
lost = (t[0] - datetime.strptime("01:52", "%H:%M")).seconds // 60
print(f"recovered in {total} min (RTO {RTO_MIN}):",
      "met" if total <= RTO_MIN else "MISSED")
print(f"data lost: {lost} min (RPO {RPO_MIN}):",
      "met" if lost <= RPO_MIN else "MISSED")`,
    },
    {
      id: 'drill-out',
      kind: 'code',
      filename: 'output',
      hug: true,
      label: `02:00  + 0 min  incident declared
02:09  + 9 min  restore started (PITR to 01:52)
02:41  +32 min  instance available
02:58  +17 min  checks passed: row counts, last orders
03:06  + 8 min  app switched to restored DB
recovered in 66 min (RTO 90): met
data lost: 8 min (RPO 15): met`,
    },
  ],
  edges: [],
}
