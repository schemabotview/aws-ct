import type { Section } from '../types'

export const quotasThrottlingAndResilience: Section = {
  id: 'quotas-throttling-and-resilience',
  title: 'Service quotas, throttling, dependency failures, and resilience validation',
  scene: 'quotas-and-resilience',
  focus: 'jitter-out',
  slide: `## Quotas, throttling and resilience

**Objective:** design around limits and prove the design under failure.

### Mental model
- **Quota**: a per-account, per-Region limit; some adjustable
- **Throttling**: a service refusing calls above a rate
- Retries need **backoff with jitter**, or they synchronise

### Worked example: the shop's limits
- Lambda concurrency, API Gateway throttle: raisable
- Lambda timeout 900 s: fixed — redesign instead
- Full jitter spreads retries; without it they collide
- Validate by injecting failure (Fault Injection Service)

### Misconception
- "Any limit can be raised" — check Adjustable first

### Explanation summary
- Know which limits bend; prove resilience by testing`,
  narration:
    "The last operational boundary is limits. A service quota is a limit per account and per Region, and the Service Quotas console and A P I say whether each one is adjustable. The table lists the ones the shop depends on. Lambda concurrent executions, one thousand per Region by default, and the A P I Gateway account throttle, ten thousand requests per second, can both be raised on request. Fargate tasks and E C two v C P Us are adjustable too, ideally well ahead of a peak. The Lambda function timeout, nine hundred seconds, cannot be raised at all: work that needs longer must be redesigned, for example as a Step Functions workflow. The command at the bottom, checked against the service model, lists Lambda's quotas with their adjustable flag. When a caller exceeds a rate, the service throttles: it refuses the call with an error, and the caller should retry. How it retries matters. The program shows capped exponential backoff with full jitter: each wait is a random time between zero and the capped exponential delay, so clients A, B and C wait different amounts. Without jitter every client waits exactly point one, point two, point four, point eight and one point six seconds, and they all retry at the same instant, throttling each other again. Finally, a resilience claim is only evidence once it has been tested: inject the failure, such as an A Z outage or a throttled dependency, with a tool like Fault Injection Service, and watch whether the alarms, retries and failover behave as designed. The misconception is that any limit can be raised; check whether it is adjustable first. So: know which limits bend, and prove resilience by breaking things on purpose. Once behaviour can be observed and recovered, next we use measurements to improve latency, resource use, and cost.",
}
