import type { Scene } from '@graphlearning/flow'

// The four DR strategies (backup and restore; pilot light; warm standby; multi-site active/active)
// trade cost against RTO/RPO; recovery order follows dependencies; failback is a planned second
// migration. RPO = data you can lose, RTO = time to recover.
// source: https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html
// source: https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/plan-for-disaster-recovery-dr.html
export const dr: Scene = {
  id: 'disaster-recovery',
  padding: 0.04,
  nodes: [
    {
      id: 'strategies',
      kind: 'table',
      label: 'Four strategies, cheapest first',
      headers: ['strategy', 'in the second Region', 'RTO', 'RPO', 'costs'],
      values: [
        ['backup and restore', 'backups only', 'hours', 'since the last backup', 'storage'],
        ['pilot light', 'data replicated, servers off', 'tens of minutes', 'seconds to minutes', 'data copies'],
        ['warm standby', 'everything, scaled down', 'minutes', 'seconds', 'a small shop'],
        ['multi-site active/active', 'everything, taking traffic', 'near zero', 'near zero', 'two shops, and conflicts'],
      ],
    },
    {
      id: 'dr-row',
      label: 'Recovery',
      bare: true,
      flow: 'LR',
      align: 'start',
      stretch: true,
      children: [
        { id: 'order', kind: 'list', icon: 'workflow', label: 'Recover in dependency order', pattern: 'network', items: ['Accounts, keys and DNS first', 'Then the network, then the orders database', 'Then the app, then the API and queues', 'Last, the lake and reports'] },
        { id: 'objectives', kind: 'list', icon: 'clock', label: 'The shop’s objectives', pattern: 'service', items: ['Checkout: RTO 90 min, RPO 15 min', 'Met in Region by §8’s drill (66 / 8)', 'Reports: RTO a day, RPO a day', 'Different parts, different strategies'] },
        { id: 'failback', kind: 'list', icon: 'repeat', label: 'Failover is half of it', pattern: 'warn', items: ['Failback is a second migration', 'Data written in the second Region must come home', 'Rehearse both, or neither is real'] },
      ],
    },
  ],
  edges: [],
}
