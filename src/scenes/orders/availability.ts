import type { Scene } from '@graphlearning/flow'

// Multi-AZ DB instance: one synchronous standby, not readable, failover typically 60-120 s.
// Multi-AZ DB cluster: a writer and two readable standbys in three AZs, failover typically under
// 35 s. Aurora: cluster volume across three AZs, up to 15 replicas, failover typically under 30 s.
// Read replicas are asynchronous; point-in-time restore creates a NEW instance from backups and
// transaction logs, to any second in the retention window (typically up to the last 5 minutes).
// source: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZSingleStandby.html
// source: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/multi-az-db-clusters-concepts.html
// source: https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Concepts.AuroraHighAvailability.html
// source: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html
// source: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html
export const availability: Scene = {
  id: 'rds-availability',
  padding: 0.04,
  nodes: [
    {
      id: 'options',
      kind: 'table',
      label: 'Five things that sound alike, and what each one is for',
      headers: ['option', 'what it is', 'readable', 'saves you from'],
      values: [
        ['Multi-AZ instance', 'one standby, kept in sync, another AZ', 'no', 'losing an AZ: failover in 1–2 min'],
        ['Multi-AZ cluster', 'a writer and two standbys, three AZs', 'yes, two', 'losing an AZ: failover under 35 s'],
        ['Aurora', 'one storage volume across three AZs', 'up to 15', 'losing an AZ: failover about 30 s'],
        ['Read replica', 'an asynchronous copy, any AZ or Region', 'yes', 'too many reads, not lost data'],
        ['Point-in-time restore', 'a NEW instance, to any second kept', 'n/a', 'a bad delete or migration'],
      ],
    },
    {
      id: 'which-saves',
      label: 'Which one saves you',
      bare: true,
      flow: 'LR',
      align: 'start',
      stretch: true,
      children: [
        { id: 's-az', kind: 'list', icon: 'server', label: 'eu-west-2b goes dark', pattern: 'network', items: ['Multi-AZ: the standby takes over', 'The endpoint’s name stays the same', 'Apps reconnect; open transactions are lost'] },
        { id: 's-reads', kind: 'list', icon: 'search', label: 'Order history is slow', pattern: 'service', items: ['A read replica takes the history queries', 'It lags: never read your own write there', 'Writes still go to the one primary'] },
        { id: 's-delete', kind: 'list', icon: 'history', label: 'A migration drops a column', pattern: 'warn', items: ['The standby dropped it too, in sync', 'Restore to 18:39, a minute before', 'A new instance; copy the data back'] },
      ],
    },
  ],
  edges: [],
}
