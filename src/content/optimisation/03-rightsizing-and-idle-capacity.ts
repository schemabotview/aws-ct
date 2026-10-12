import type { Section } from '../types'

export const rightsizingAndIdleCapacity: Section = {
  id: 'rightsizing-and-idle-capacity',
  title: 'Rightsizing, concurrency, scaling efficiency, and idle capacity',
  scene: 'capacity-plans',
  focus: 'plans-out',
  slide: `## Rightsizing and idle capacity

**Objective:** separate waste from deliberate reserve.

### Mental model
- **Rightsizing**: the smallest resource that meets the need
- **Concurrency** needed = arrival rate × time per request
- **Idle capacity**: provisioned, unused — waste or reserve

### Worked example: one day, four capacity plans
- Fixed 4 large: 96 server-hours, 43% busy
- No AZ reserve: 52 h, 80% busy — an AZ loss breaks it
- Elastic, AZ-safe: 90 h, 46% busy
- Medium, AZ-safe: 78 h, 53% busy — smaller steps
- The plot: medium capacity tracks demand more closely

### Misconception
- "Low utilisation is waste" — part of it survives an AZ

### Explanation summary
- Rightsize within the reliability target, not below it`,
  narration:
    "Idle capacity is the next target, but not all of it is waste. Rightsizing means choosing the smallest resource that meets the need. Concurrency is how many requests are in progress at once: the arrival rate multiplied by the time each takes, which is how the integration chapter sized Lambda. And idle capacity is what is provisioned but unused. The program compares four capacity plans for the same day of demand, sixty, two hundred and forty, then five hundred and sixty requests a second. Fixed at four large servers, the shop uses ninety six server hours a day and is forty three percent busy. Elastic, with no reserve, it needs only fifty two hours and is eighty percent busy. But that plan fails when an Availability Zone is lost, because nothing is left over. The A Z safe plan sizes each band so that the remaining two zones can carry all the traffic: ninety hours, forty six percent busy. That is the shop's real configuration, three servers rising to six in the evening. Then rightsizing: medium servers with half the capacity, assumed at half the price, let each step be smaller. A Z safe on mediums costs the equivalent of seventy eight large hours, fifty three percent busy, without giving up the reserve. The plot shows why: the medium line follows demand more closely in the morning and the day, while both lines meet at the evening peak. The misconception is that low utilisation is always waste; part of it is what keeps the shop up when a zone fails. So: rightsize within the reliability target, not below it.",
}
