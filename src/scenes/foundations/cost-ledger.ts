import type { Scene } from '@graphlearning/flow'

// §1.6 — the development environment's month, running versus stopped, from the course's
// HYPOTHETICAL rate card (CLAUDE.md). `ledger-out` is checked against a real run of `ledger`.
// source: https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html
// (budget data is updated up to three times a day; costs can exceed a threshold before the
// notification; budget actions can apply policies or stop EC2/RDS instances)
export const costLedger: Scene = {
  id: 'cost-ledger',
  title: 'What a stopped environment still costs',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'ledger',
      kind: 'code',
      filename: 'cost_ledger.py · runs locally',
      hug: true,
      label: `# Hypothetical rates in USD -- not a price quote
HOURS = 730  # hours in an average month
items = [
    # (resource, monthly cost, billed when stopped?)
    ("app instance", HOURS * 0.04, False),
    ("30 GB volume", 30 * 0.08, True),
    ("Elastic IP", HOURS * 0.005, True),
    ("10 GB snapshot", 10 * 0.05, True),
    ("20 GB objects", 20 * 0.023, True),
]
print(f"{'resource':<15}{'running':>9}{'stopped':>9}")
for name, cost, kept in items:
    left = cost if kept else 0
    print(f"{name:<15}{cost:>9.2f}{left:>9.2f}")
run = sum(c for _, c, _ in items)
stop = sum(c for _, c, kept in items if kept)
print(f"{'month total':<15}{run:>9.2f}{stop:>9.2f}")`,
    },
    {
      id: 'ledger-out',
      kind: 'code',
      filename: 'output',
      hug: true,
      label: `resource         running  stopped
app instance       29.20     0.00
30 GB volume        2.40     2.40
Elastic IP          3.65     3.65
10 GB snapshot      0.50     0.50
20 GB objects       0.46     0.46
month total        36.21     7.01`,
    },
  ],
  edges: [{ source: 'ledger', target: 'ledger-out', label: 'python3 cost_ledger.py' }],
}
