import type { Scene } from '@graphlearning/flow'

// §12.3 — one Region with three AZs vs two Regions. The regional-failure case runs locally with an
// ASSUMED 2 s replication lag; Route 53 health checks default to a 30 s interval and a failure
// threshold of 3. Active/active needs a conflict rule: DynamoDB global tables use last writer wins,
// which cannot stop two Regions selling the last unit.
// source: https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/health-checks-creating-values.html
// source: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/V2globaltables_HowItWorks.html
export const regionChoices: Scene = {
  id: 'region-choices',
  title: 'A second Region is a data decision',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'failure',
      kind: 'code',
      filename: 'region_failure.py · runs locally',
      hug: true,
      label: `ORDERS_PER_S = 6           # evening checkouts (Ch. 6)
LAG_S = 2.0                # async replication to eu-west-1 (assumed)
print(f"active/passive: ~{ORDERS_PER_S * LAG_S:.0f} acknowledged orders"
      " not yet in eu-west-1 at failover")

DETECT_S = 3 * 30          # Route 53 health check: 3 failures x 30 s
TTL_S = 60                 # resolvers may keep the old answer this long
print(f"traffic moves after up to {DETECT_S + TTL_S} s, if eu-west-1 is ready")

# active/active: both Regions accept writes for p-1002, one unit left
stock = {"eu-west-2": 1, "eu-west-1": 1}
sold = 0
for region in stock:
    stock[region] -= 1
    sold += 1
    print(f"{region}: sells p-1002, local stock {stock[region]}")
print(f"after replication: {sold} sold, 1 existed -> {sold - 1} order cannot ship")`,
    },
    {
      id: 'failure-out',
      kind: 'code',
      filename: 'output',
      hug: true,
      label: `active/passive: ~12 acknowledged orders not yet in eu-west-1 at failover
traffic moves after up to 150 s, if eu-west-1 is ready
eu-west-2: sells p-1002, local stock 0
eu-west-1: sells p-1002, local stock 0
after replication: 2 sold, 1 existed -> 1 order cannot ship`,
    },
    {
      id: 'scopes',
      kind: 'table',
      label: 'How far to spread',
      sub: 'each step adds cost and failure modes',
      headers: ['choice', 'survives', 'data consequence'],
      values: [
        ['one AZ', 'instance failure', 'one copy'],
        ['multi-AZ, one Region', 'an AZ', 'synchronous standby, RPO 0'],
        ['two Regions, active/passive', 'a Region', 'async: recent writes lost'],
        ['two Regions, active/active', 'a Region, fast', 'conflicts need a rule'],
      ],
    },
  ],
  edges: [],
}
