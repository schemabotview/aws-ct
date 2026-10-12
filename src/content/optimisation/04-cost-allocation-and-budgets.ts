import type { Section } from '../types'

export const costAllocationAndBudgets: Section = {
  id: 'cost-allocation-and-budgets',
  title: 'Cost allocation, tags, Cost Explorer, budgets, and anomaly investigation',
  scene: 'cost-allocation',
  focus: 'lines-out',
  slide: `## Cost allocation and anomalies

**Objective:** attribute cost, notice change, and find its cause.

### Mental model
- **Accounts and tags** say whose cost it is
- **Cost Explorer**: cost by day, service, account or tag
- **Budget**: a threshold that alerts — it does not stop spend

### Worked example: one week (hypothetical USD)
- env=prod 93%, dev 5%, untagged 2%
- Anomaly: NAT on 10-09, 42.20 vs median 3.80
- Cause: 768 GB from S3 through NAT, not the endpoint
- Budget: alert if forecast passes 80% of 400
- Cost Anomaly Detection runs this check as a service

### Misconception
- "A budget caps spending" — it notifies; people act

### Explanation summary
- Tag and separate accounts first; investigate every jump`,
  narration:
    "Optimising cost needs to know whose cost it is. Separate accounts already split the bill: production and development each have their own line. Within an account, tags such as env equals prod do the same, but only once they are activated as cost allocation tags, and only from then on. Cost Explorer shows cost by day, service, account or tag. A budget is a threshold that sends an alert. The program reads one week of daily cost lines in hypothetical dollars. Grouped by the env tag, production is ninety three percent, development five, and two percent is untagged, which nobody can be asked about. Then it looks for anomalies: any service whose day costs more than three times its median. The NAT gateway on the ninth of October cost forty two dollars twenty against a median of three eighty. The investigation found a job that copied seven hundred and sixty eight gigabytes from S three through the NAT gateway instead of the S three gateway endpoint from the networking chapter, and paid processing on every gigabyte. The Cost Explorer command, checked against the service model, produces the same view from the real bill: daily unblended cost grouped by service and by the env tag. The budget request, validated in full, emails operations when the production account's month is forecast to pass eighty percent of four hundred dollars. A W S Cost Anomaly Detection can do the median comparison as a managed service. The misconception is that a budget caps spending. It notifies; people, or actions you configure, respond. So: tag and separate accounts first, and investigate every jump.",
}
