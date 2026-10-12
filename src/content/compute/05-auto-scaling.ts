import type { Section } from '../types'

export const autoScaling: Section = {
  id: 'auto-scaling',
  title: 'Auto Scaling, health replacement, scaling signals, and capacity delays',
  scene: 'scaling-timeline',
  focus: 'surge-out',
  slide: `## Auto Scaling and capacity delays

**Objective:** say how late new capacity arrives, and plan around it.

### Mental model
- An **Auto Scaling group** keeps between min and max instances
- It **replaces** instances that fail health checks
- **Signals**: target tracking, steps, or a **schedule**

### Worked example: the 18:00 surge
- Demand 240 → **560 req/s** in four minutes
- Reactive from 3 servers: **5 min short**, worst **110 req/s**
- Scheduled min 6 at 17:45: **never short**

### Misconception
- "Auto Scaling is instant" — metrics lag, servers take minutes

### Explanation summary
- React to the unexpected; schedule the expected`,
  narration:
    "An Auto Scaling group turns the launch template into a fleet. It keeps the number of instances between a minimum and a maximum, spreads them across the zones, and replaces any instance that fails its health checks. To change the size it needs a signal: target tracking, which keeps a metric near a target; step policies; or a schedule. Let's test reactive scaling against the shop's evening surge, with code. At eighteen hundred, demand climbs from two hundred and forty to five hundred and sixty requests a second over four minutes. The group starts with three servers, scales to keep twenty five percent headroom, sees its metric a minute late, and, by our assumption, a new server takes five minutes from launch to serving traffic. The result: five minutes in which demand exceeds capacity, at worst by one hundred and ten requests a second. Those are the slow pages and failed checkouts of the busiest moment of the day. Now the scheduled version. The surge is not a surprise; it happens every evening. A scheduled action raises the minimum to six at seventeen forty five, London time, and the request beside it was validated against the Auto Scaling A P I. With six servers already serving, the model is never short. Capacity is also not unlimited: a group cannot exceed its maximum, the account has quotas, and a zone can run short of a particular instance type. The misconception is that Auto Scaling is instant. Metrics arrive late and servers take minutes. So react to the unexpected, and schedule the expected.",
}
