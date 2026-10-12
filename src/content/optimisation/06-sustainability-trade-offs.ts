import type { Section } from '../types'

export const sustainabilityTradeOffs: Section = {
  id: 'sustainability-trade-offs',
  title: 'Sustainability: utilisation, data movement, retention, and operational constraints',
  scene: 'sustainability-levers',
  focus: 'levers-out',
  slide: `## Sustainability

**Objective:** use fewer resources, under stated limits.

### Mental model
- Use **fewer resources per unit of work**
- **Move and keep less data**
- Measure resource use; AWS estimates the carbon

### Worked example: three levers
- Medium AZ-safe servers: 90 → 78 server-hours a day
- 30-day log retention: 730 → 60 GB held after a year
- 90% edge hits: origin traffic 900 → 90 GB a month
- That traffic moves to the edge; it does not vanish
- Each keeps a constraint: AZ reserve, audit, freshness

### Misconception
- "Cheaper is greener" — price and carbon differ

### Explanation summary
- Cut idle, movement and retention; state each constraint`,
  narration:
    "Sustainability uses the same measurements with a different aim: fewer resources for each unit of useful work, and less data moved and kept. The program measures resource use, not carbon, with assumed volumes; A W S's Customer Carbon Footprint Tool reports estimated emissions for an account. Three levers apply to the shop. Moving to medium servers while keeping the A Z reserve cuts app server time from ninety to seventy eight large server hours a day, thirteen percent less. Keeping application logs for thirty days instead of forever means sixty gigabytes held after a year instead of seven hundred and thirty, ninety two percent less. And a ninety percent edge hit ratio cuts traffic served by the origin from nine hundred to ninety gigabytes a month; that traffic moves to the edge rather than disappearing. The table pairs each choice with its constraint. Graviton and right-sized instances reduce energy per request, provided the app is tested on Arm, as the shop's is. Scaling to demand removes idle servers but must keep the A Z reserve. Thirty-day application logs reduce bytes stored, while the audit trail is still kept for a year. Archiving old exports moves them to a colder tier, but restores take hours. Edge caching avoids repeated transfer within its freshness limit. And a cheaper Region lowers price, not necessarily carbon, and the shop's data must stay in the U K anyway. The misconception is that the cheaper option is always the greener one; price and carbon are different measurements. So: cut idle capacity, data movement and retention, and state each constraint. Individual optimisations must fit the whole workload; next we integrate requirements and evidence into architectural decisions.",
}
