import type { Scene } from '@graphlearning/flow'

// §11.5 — one production month under a HYPOTHETICAL rate card (labelled on the card; extends the
// frozen one with NAT, transfer and log rates) and ASSUMED volumes, runs locally. Commitment rate
// 0.028/h is Ch. 4's. Purchase options per the Savings Plans and Spot documentation; Spot gives a
// two-minute interruption notice. Advertised discounts are not guaranteed savings.
// source: https://docs.aws.amazon.com/savingsplans/latest/userguide/what-is-savings-plans.html
// source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-interruptions.html
export const monthlyCost: Scene = {
  id: 'monthly-cost',
  title: 'Where the month goes',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'month',
      kind: 'code',
      filename: 'monthly_cost.py · runs locally',
      hug: true,
      label: `# HYPOTHETICAL rate card, USD (not AWS prices); volumes are assumptions
R = {"instance_h": 0.04, "nat_h": 0.05, "nat_gb": 0.05, "internet_gb": 0.09,
     "cross_az_gb": 0.02, "logs_gb": 0.50, "snapshot_gb": 0.05, "object_gb": 0.023}
month = {
    "app servers, 90 h/day": 2700 * R["instance_h"],
    "NAT gateways, 3 x 730 h": 3 * 730 * R["nat_h"],
    "NAT processing, 120 GB": 120 * R["nat_gb"],
    "internet egress, 900 GB": 900 * R["internet_gb"],
    "cross-AZ app<->DB, 400 GB": 400 * R["cross_az_gb"],
    "logs ingested, 60 GB": 60 * R["logs_gb"],
    "DB backups, 300 GB": 300 * R["snapshot_gb"],
    "catalog + images, 200 GB": 200 * R["object_gb"],
}
total = sum(month.values())
for item, usd in sorted(month.items(), key=lambda kv: -kv[1]):
    print(f"{item:<26} {usd:>7.2f}  {usd / total:4.0%}")
print(f"{'total':<26} {total:>7.2f}")

committed = 2160 * 0.028 + 540 * R["instance_h"]   # 3 committed, 3 on-demand
print(f"servers: all on-demand {2700 * R['instance_h']:.2f},"
      f" with commitment {committed:.2f}")
print(f"commitment saves only above {0.028 / R['instance_h']:.0%}"
      " use of committed hours")`,
    },
    {
      id: 'month-out',
      kind: 'code',
      filename: 'output',
      hug: true,
      label: `NAT gateways, 3 x 730 h     109.50   30%
app servers, 90 h/day       108.00   30%
internet egress, 900 GB      81.00   22%
logs ingested, 60 GB         30.00    8%
DB backups, 300 GB           15.00    4%
cross-AZ app<->DB, 400 GB     8.00    2%
NAT processing, 120 GB        6.00    2%
catalog + images, 200 GB      4.60    1%
total                       362.10
servers: all on-demand 108.00, with commitment 82.08
commitment saves only above 70% use of committed hours`,
    },
    {
      id: 'options',
      kind: 'table',
      label: 'Paying for the same server-hours',
      sub: 'a discount is a bet on future use',
      headers: ['option', 'pays off when', 'risk'],
      values: [
        ['on-demand', 'use is uncertain', 'highest rate'],
        ['Savings Plan / Reserved', 'use stays above break-even', 'paid if unused, 1–3 years'],
        ['Spot', 'work survives interruption', '2-minute notice'],
      ],
    },
  ],
  edges: [],
}
