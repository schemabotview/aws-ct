import type { Section } from '../types'

export const availabilityReadScalingRestore: Section = {
  id: 'availability-read-scaling-restore',
  title: 'Availability, read scaling, backups, and restore: distinct database capabilities',
  scene: 'rds-availability',
  focus: 'variants',
  slide: `## Failover, read scaling and restore

**Objective:** say which capability answers which failure.

### Mental model
- **Multi-AZ DB instance**: one hidden standby; failover ~1–2 min
- **Multi-AZ DB cluster**: two **readable** standbys; typically <35 s
- **Read replica**: asynchronous, readable, may **lag**
- **Backups + PITR**: restore to a second, as a **new** instance

### Worked example: two incidents at 18:05
- AZ lost → Multi-AZ fails over; no data restore needed
- A bad UPDATE → the standby **has it too**
- Restore to 18:04 as a new instance, then switch

### Misconception
- "Multi-AZ is my backup" — it copies mistakes instantly

### Explanation summary
- Availability, scale, recovery: three separate decisions`,
  narration:
    "Four database capabilities are routinely blurred together, and the plan asks us to keep them apart. A Multi A Z D B instance deployment has one standby in another zone, kept in step synchronously, and not readable; if the primary fails, R D S fails over to it, typically in about one to two minutes. A Multi A Z D B cluster has two standbys that can serve reads, and A W S says failover is typically under thirty five seconds. Aurora shares one storage volume, six copies across three zones, among a writer and up to fifteen replicas. A read replica is a different thing again: it is asynchronous, it serves reads, it can lag behind the primary, and promoting it is a deliberate step, not an automatic failover. And backups with point in time recovery let you restore to any second within the retention window, from one to thirty five days, but always as a new instance. Now two incidents at five past six in the evening. First, a zone is lost. Multi A Z fails over, and no data needs restoring. Second, a deployment runs an update that sets every price to zero. The standby received that update synchronously; it is just as wrong. The only answer is a point in time restore to four minutes past six, into a new instance, and then switching the application to it. The misconception is that Multi A Z is a backup. It copies every mistake instantly. Availability, read scaling and recovery are three separate decisions, each with its own evidence.",
}
