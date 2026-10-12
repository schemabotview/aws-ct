import type { Section } from '../types'

export const loadBalancersAndHealth: Section = {
  id: 'load-balancers-and-health',
  title: 'Load balancers, target groups, health checks, and traffic distribution',
  scene: 'lb-health',
  focus: 'timeline-out',
  slide: `## Load balancers and health checks

**Objective:** predict how long a broken server keeps receiving traffic.

### Mental model
- An **ALB** routes HTTP; an **NLB** forwards TCP/UDP
- A **target group** is the set of servers behind a listener
- **Health checks** add and remove targets automatically

### Worked example: app-3 fails
- Check every **10 s**; **2** failures → unhealthy at **15 s**
- Fixed at 60 s; **3** passes → back at **85 s**
- 560 req/s: 93 each over 6 targets, **112** over 5

### Misconception
- "Unhealthy is removed instantly" — thresholds × interval sets the delay

### Explanation summary
- Set thresholds on purpose; keep spare capacity per target`,
  narration:
    "The load balancer is where many app servers become one service. An application load balancer understands H T T P, so it can route by path or host; a network load balancer forwards T C P and U D P with very low overhead. Behind a listener sits a target group, the set of servers that should receive traffic. Health checks decide which members actually get it. The command creates the shop's target group and sets every health check value explicitly rather than relying on defaults: check the slash health path every ten seconds, mark a target unhealthy after two failures in a row, and healthy again after three successes. Now the timeline, computed by the code with exactly those numbers. App three breaks at time zero. The checks at five and fifteen seconds fail, so at fifteen seconds it is marked unhealthy and traffic stops. Until then, roughly fifteen seconds of requests went to a broken server. It is fixed at sixty seconds, and three passing checks bring it back at eighty five seconds. Meanwhile the evening's five hundred and sixty requests a second are spread across fewer targets: about ninety three each across six, about one hundred and twelve each across five. Our servers handle one hundred and fifty, so the others absorb it. The misconception is that a failing target disappears instantly. The interval times the threshold sets the delay in both directions. So set those thresholds on purpose, and keep spare capacity for the moments a target is out.",
}
