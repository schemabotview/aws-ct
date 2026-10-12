import type { Scene } from '@graphlearning/flow'

// §11.4 — a week of cost lines grouped by the env tag and scanned for anomalies (HYPOTHETICAL USD;
// runs locally): the NAT spike on 10-09 is 768 GB pulled from S3 through NAT instead of the gateway
// endpoint (Ch. 3). Cost Explorer CLI model-checked; budget request validated in full. A budget
// alerts — it does not stop spending. User-defined tags count only after activation as cost
// allocation tags, and not retroactively.
// source: https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/cost-alloc-tags.html
// source: https://docs.aws.amazon.com/cost-management/latest/userguide/budgets-managing-costs.html
export const costAllocation: Scene = {
  id: 'cost-allocation',
  title: 'Who spent it, and what changed?',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'lines',
      kind: 'code',
      filename: 'cost_lines.py · runs locally',
      hug: true,
      label: `from collections import defaultdict
from statistics import median

# one week of daily cost lines, HYPOTHETICAL USD: (service, env tag) -> cost
daily = {("EC2", "prod"): 3.24, ("RDS", "prod"): 4.10,
         ("NAT gateway", "prod"): 3.80, ("EC2", "dev"): 0.96, ("S3", None): 0.30}
spike = {("10-09", "NAT gateway"): 38.40}           # 768 GB through NAT
lines = [(day, svc, env, usd + spike.get((day, svc), 0))
         for day in [f"10-{d:02d}" for d in range(4, 11)]
         for (svc, env), usd in daily.items()]

by_env = defaultdict(float)
for _, _, env, usd in lines:
    by_env[env or "untagged"] += usd
total = sum(by_env.values())
for env, usd in by_env.items():
    print(f"env={env:<9} {usd:>7.2f}  {usd / total:4.0%}")

for svc in dict.fromkeys(s for _, s, _, _ in lines):
    series = [(d, u) for d, s, _, u in lines if s == svc]
    typical = median(u for _, u in series)
    for day, usd in series:
        if usd > 3 * typical:
            print(f"anomaly {day} {svc}: {usd:.2f} vs median {typical:.2f}")`,
    },
    {
      id: 'lines-out',
      kind: 'code',
      filename: 'output',
      hug: true,
      label: `env=prod       116.38   93%
env=dev          6.72    5%
env=untagged     2.10    2%
anomaly 10-09 NAT gateway: 42.20 vs median 3.80`,
    },
    {
      id: 'tools',
      label: 'Find it in the bill, then fence it',
      pattern: 'group',
      cols: 2,
      children: [
        {
          id: 'explorer',
          kind: 'code',
          filename: 'cost-explorer.sh · model-checked',
          hug: true,
          label: `aws ce get-cost-and-usage \\
  --time-period Start=2026-10-04,End=2026-10-11 \\
  --granularity DAILY --metrics UnblendedCost \\
  --group-by Type=DIMENSION,Key=SERVICE Type=TAG,Key=env`,
        },
        {
          id: 'budget',
          kind: 'code',
          filename: 'budgets.CreateBudget.request.json · model-checked',
          hug: true,
          label: `{
  "AccountId": "111122223333",
  "Budget": {
    "BudgetName": "shop-prod-monthly",
    "BudgetLimit": { "Amount": "400", "Unit": "USD" },
    "TimeUnit": "MONTHLY",
    "BudgetType": "COST"
  },
  "NotificationsWithSubscribers": [{
    "Notification": {
      "NotificationType": "FORECASTED",
      "ComparisonOperator": "GREATER_THAN",
      "Threshold": 80, "ThresholdType": "PERCENTAGE"
    },
    "Subscribers": [{ "SubscriptionType": "EMAIL",
      "Address": "ops@shop.example.com" }]
  }]
}`,
        },
      ],
    },
  ],
  edges: [],
}
