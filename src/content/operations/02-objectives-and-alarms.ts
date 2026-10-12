import type { Section } from '../types'

export const objectivesAndAlarms: Section = {
  id: 'objectives-and-alarms',
  title: 'Service objectives, alarms, dashboards, and actionable signals',
  scene: 'slos-and-alarms',
  focus: 'slo-out',
  slide: `## Objectives and alarms

**Objective:** alarm on what users feel, at a rate worth waking for.

### Mental model
- **SLO**: the share of good events promised, e.g. 99.9%
- **Error budget**: the failures that promise allows
- **Burn rate**: how fast failures spend that budget

### Worked example: checkout at 99.9%
- ~6 checkouts/s over 30 days → 15,552 failures allowed
- 2% errors burn 20× → budget gone in 1.5 days
- Alarm: 5xx > 50/min for 5 min → ops-pager
- Dashboards show context; alarms ask for an action

### Misconception
- "An alarm fixes it" — it notifies; someone acts

### Explanation summary
- Page on budget burn; let dashboards explain`,
  narration:
    "Telemetry produces far more signals than anyone can watch, so the next step is deciding which ones deserve a person's attention. A service level objective states what share of events must be good, here ninety nine point nine percent of checkouts over thirty days. The rest, the error budget, is how many failures that promise allows. The burn rate is how fast current failures spend it: a burn of one spends it exactly over the thirty days. The program works this through. Around six checkouts a second for thirty days allows fifteen thousand five hundred and fifty two failed checkouts. A point one percent error rate burns at one times and lasts the month. Half a percent burns at five times, gone in six days. Two percent burns at twenty times, and the budget is gone in a day and a half. That last case is worth paging someone for. The card on the right is the CloudWatch alarm for it, a PutMetricAlarm request checked against the service model: the load balancer's target five hundred errors, summed per minute, above fifty in five out of five minutes, notifies the S N S topic ops-pager. Missing data counts as not breaching, so a quiet night does not page. Dashboards have a different job: they give context once someone is looking. The misconception is that an alarm fixes the problem. It changes state and sends a notification; a person, or an automated runbook you built separately, does the fixing. So: page on budget burn, and let dashboards explain.",
}
