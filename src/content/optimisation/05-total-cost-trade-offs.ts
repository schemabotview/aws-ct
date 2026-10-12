import type { Section } from '../types'

export const totalCostTradeOffs: Section = {
  id: 'total-cost-trade-offs',
  title: 'Transfer, requests, storage, commitments, and total-cost trade-offs',
  scene: 'monthly-cost',
  focus: 'month-out',
  slide: `## The whole monthly cost

**Objective:** compare options on total cost, with stated assumptions.

### Mental model
- **Total cost**: compute, transfer, requests, storage, logs
- Rates are **hypothetical**; volumes are assumptions
- **Commitments** trade a lower rate for paying regardless

### Worked example: one production month (hypothetical)
- NAT gateways 109.50 ≈ app servers 108.00: 30% each
- Internet egress 81.00; logs 30.00; backups 15.00
- Total 362.10; commitment: servers 108.00 → 82.08
- The commitment saves only above 70% use

### Misconception
- "A 30% discount saves 30%" — only if the usage stays

### Explanation summary
- Price every line, then test the assumptions that drive it`,
  narration:
    "Server hours are rarely the whole bill. Total cost includes compute, data transfer, requests, storage and logs. The rates on this card are hypothetical, extending the course's rate card, and the volumes are assumptions; both are labelled so that the method, not the numbers, is what carries over. Sorted by size, the month starts with a surprise. Three NAT gateways, one per Availability Zone, running all month cost one hundred and nine dollars fifty, slightly more than the app servers at one hundred and eight: thirty percent each. Internet egress for nine hundred gigabytes is eighty one dollars, twenty two percent. Logs ingested cost thirty dollars, database backups fifteen, cross-A Z traffic between the app and the database eight, NAT processing six, and the catalog and images in S three four sixty. The total is three hundred and sixty two dollars ten. That ordering changes the optimisation: endpoints instead of NAT for A W S services, caching to cut egress, and log levels before instance sizes. Then commitments. Committing to the three baseline servers at the course's committed rate, with the evening three on demand, brings servers from one hundred and eight dollars to eighty two oh eight. But the commitment is paid whether used or not, so it saves money only while more than seventy percent of the committed hours are used. The table compares the purchase options. On-demand suits uncertain use, at the highest rate. Savings Plans and Reserved Instances pay off while use stays above break-even, and are paid even if unused, for one to three years. Spot suits work that survives interruption, with a two-minute notice. The misconception is that a thirty percent discount saves thirty percent; it does only if the usage stays. So: price every line, then test the assumptions that drive it.",
}
