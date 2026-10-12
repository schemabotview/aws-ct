import type { Section } from '../types'

export const disasterRecoveryAndFailover: Section = {
  id: 'disaster-recovery-and-failover',
  title: 'RTO/RPO, dependency recovery, failover/failback, and regional disaster recovery',
  scene: 'disaster-recovery',
  focus: 'rpo-out',
  slide: `## Disaster recovery

**Objective:** match each failure to the copy that survives it.

### Mental model
- **RTO**: how long recovery may take
- **RPO**: how much recent data may be lost
- Recovery includes **dependencies**: DNS, secrets, keys, quotas

### Worked example: the orders data
- AZ lost → Multi-AZ standby: 0 min lost
- Bad UPDATE → standby has it too; PITR: ≤ 5 min
- Region lost → nightly cross-Region copy: ≤ 1 day
- Four DR strategies: cost rises as RTO falls

### Misconception
- "Replication is a backup" — it copies corruption too

### Explanation summary
- Name the incident; then pick the copy, the strategy and failback`,
  narration:
    "Recovery targets only mean something against a particular failure. The recovery time objective is how long recovery may take; the recovery point objective is how much recent data may be lost. And recovery is never just the database: D N S, secrets, K M S keys, I A M roles and service quotas must all exist where you recover to. The program pairs three incidents with the orders data's copies. If an Availability Zone is lost, the Multi-AZ standby takes over with zero data lost. But if the incident is a bad UPDATE that corrupts rows, the standby has the same bad rows, so the usable copy is a point in time restore, which loses up to about five minutes because transaction logs are shipped that often. If the whole Region is lost, neither helps; the only usable copy is the nightly cross-Region copy, which could be up to fourteen hundred and forty minutes, a whole day, old. The table lists A W S's regional disaster recovery strategies, from cheapest and slowest to dearest and fastest. Backup and restore keeps only backups and templates in the second Region, and recovers in hours. Pilot light keeps the data live but compute off, tens of minutes. Warm standby runs a small working copy, minutes. Multi-site active active runs full capacity in both, near zero. Failing over is half the job: failback, returning once the first Region recovers, needs its own plan, because data written during the outage must flow back. The misconception is that replication is a backup; it replicates deletions and corruption too. So: name the incident first, then pick the copy, the strategy and the way back.",
}
