import type { Scene } from '@graphlearning/flow'

// §8.1 — operational state vs analytical history. The orders table answers "what is true now"; only a
// history of changes answers "what was true at 20:00" — o-501 is SHIPPED now but was PAID-not-shipped
// then. The pipeline the chapter builds: order changes → S3 → Glue catalog → Athena.
// source: https://docs.aws.amazon.com/whitepapers/latest/aws-overview/analytics.html
export const stateVsHistory: Scene = {
  id: 'state-vs-history',
  title: 'Now versus over time',
  flow: 'TB',
  padding: 0.05,
  nodes: [
    {
      id: 'pipeline',
      label: 'The chapter’s pipeline',
      pattern: 'group',
      cols: 4,
      children: [
        { id: 'p-db', label: 'Orders DB', sub: 'current state', pattern: 'storage', icon: 'rds' },
        { id: 'p-s3', label: 'S3 lake', sub: 'every change', pattern: 'storage', icon: 's3' },
        { id: 'p-glue', label: 'Glue catalog', sub: 'table metadata', pattern: 'service', icon: 'glue' },
        { id: 'p-athena', label: 'Athena', sub: 'SQL over S3', pattern: 'service', icon: 'athena' },
      ],
    },
    {
      id: 'hist',
      kind: 'code',
      filename: 'history.py · runs locally',
      hug: true,
      label: `# operational: the orders table keeps the CURRENT state only
orders = {"o-501": "SHIPPED", "o-502": "PAID", "o-503": "PLACED"}

# analytical: every change, kept with its time (CDC history)
changes = [
    ("o-501", "PLACED", "18:04"), ("o-501", "PAID", "18:05"),
    ("o-502", "PLACED", "18:10"), ("o-502", "PAID", "18:12"),
    ("o-501", "SHIPPED", "21:30"), ("o-503", "PLACED", "22:15"),
]


def status_at(order, clock):  # replay history up to a moment
    seen = [s for o, s, t in changes if o == order and t <= clock]
    return seen[-1] if seen else None


print("now, from the orders table:", orders)
print("paid but not shipped at 20:00:",
      [o for o in orders if status_at(o, "20:00") == "PAID"])`,
    },
    {
      id: 'hist-out',
      kind: 'code',
      filename: 'output',
      hug: true,
      label: `now, from the orders table: {'o-501': 'SHIPPED', 'o-502': 'PAID', 'o-503': 'PLACED'}
paid but not shipped at 20:00: ['o-501', 'o-502']`,
    },
  ],
  edges: [],
}
