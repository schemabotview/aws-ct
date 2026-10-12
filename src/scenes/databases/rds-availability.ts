import type { Scene } from '@graphlearning/flow'

// §6.4 — four capabilities that are routinely blurred, kept apart. Multi-AZ DB instance: one standby,
// not readable, synchronous, failover about 1–2 min. Multi-AZ DB cluster: two READABLE standbys,
// failover typically under 35 s. Aurora: storage 6 ways across 3 AZs, up to 15 replicas. Read
// replicas: asynchronous, readable, lag, manual promotion. Backups: 1–35 days, point-in-time restore
// creates a NEW instance.
// source: https://aws.amazon.com/rds/features/multi-az/
// source: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html
// source: https://docs.aws.amazon.com/AmazonRDS/latest/gettingstartedguide/managing-backup-restore.html
export const rdsAvailability: Scene = {
  id: 'rds-availability',
  title: 'Failover, read scaling and restore are different things',
  flow: 'TB',
  padding: 0.06,
  nodes: [
    {
      id: 'variants',
      kind: 'table',
      label: 'What each option actually gives you',
      sub: 'RDS / Aurora, PostgreSQL',
      headers: ['option', 'readable copy?', 'copy is', 'answers'],
      values: [
        ['Multi-AZ DB instance', 'no', 'synchronous', 'AZ failure, ~1–2 min'],
        ['Multi-AZ DB cluster', '2 readers', 'synchronous*', 'AZ failure, <35 s'],
        ['Aurora + replicas', 'up to 15', 'shared storage', 'failure + reads'],
        ['read replica', 'yes', 'asynchronous', 'read load, not HA'],
        ['backups + PITR', 'no', 'point in time', 'deletion, corruption'],
      ],
    },
    {
      id: 'failure-cases',
      kind: 'list',
      framed: true,
      label: 'Which one saves you?',
      icon: 'history',
      pattern: 'warn',
      items: [
        'AZ lost at 18:05 → Multi-AZ fails over',
        'a bad UPDATE at 18:05 → standby has it too',
        '→ PITR to 18:04, as a NEW instance',
        '* a cluster commits once one standby confirms',
      ],
    },
  ],
  edges: [],
}
