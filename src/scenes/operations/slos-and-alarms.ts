import type { Scene } from '@graphlearning/flow'

// §10.2 — an objective, its error budget and burn rate, and an alarm that pages a person (validated
// PutMetricAlarm request). The alarm NOTIFIES through SNS; it fixes nothing. 99.9% of ~6 checkouts/s
// over 30 days allows 15,552 failures; a 2% error rate burns it in 1.5 days.
// source: https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html
export const slosAndAlarms: Scene = {
  id: 'slos-and-alarms',
  title: 'An objective turns noise into a decision',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'budget',
      label: 'Checkout objective: 99.9%',
      pattern: 'group',
      cols: 1,
      children: [
        {
          id: 'slo',
          kind: 'code',
          filename: 'error_budget.py · runs locally',
          hug: true,
          label: `SLO = 0.999                    # successful checkouts over 30 days
checkouts = 6 * 86400 * 30     # ~6 per second (Ch. 6)
budget = checkouts * (1 - SLO)
print(f"30-day error budget: {budget:,.0f} failed checkouts")

for error_rate in (0.001, 0.005, 0.02):
    burn = error_rate / (1 - SLO)   # 1.0 = spending exactly on plan
    days = 30 / burn
    print(f"error rate {error_rate:.1%}: burn {burn:>4.0f}x,"
          f" budget gone in {days:>4.1f} days")`,
        },
        {
          id: 'slo-out',
          kind: 'code',
          filename: 'output',
          hug: true,
          label: `30-day error budget: 15,552 failed checkouts
error rate 0.1%: burn    1x, budget gone in 30.0 days
error rate 0.5%: burn    5x, budget gone in  6.0 days
error rate 2.0%: burn   20x, budget gone in  1.5 days`,
        },
      ],
    },
    {
      id: 'alarm',
      kind: 'code',
      filename: 'cloudwatch.PutMetricAlarm.request.json · model-checked',
      hug: true,
      label: `{
  "AlarmName": "checkout-5xx-fast-burn",
  "Namespace": "AWS/ApplicationELB",
  "MetricName": "HTTPCode_Target_5XX_Count",
  "Dimensions": [{ "Name": "LoadBalancer",
    "Value": "app/shop-alb/50dc6c495c0c9188" }],
  "Statistic": "Sum", "Period": 60,
  "EvaluationPeriods": 5, "DatapointsToAlarm": 5,
  "Threshold": 50,
  "ComparisonOperator": "GreaterThanThreshold",
  "TreatMissingData": "notBreaching",
  "AlarmActions": ["arn:aws:sns:eu-west-2:111122223333:ops-pager"]
}`,
    },
  ],
  edges: [],
}
