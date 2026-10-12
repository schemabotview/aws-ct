import type { Section } from '../types'

export const routeTables: Section = {
  id: 'route-tables',
  title: 'Route tables, local routing, internet gateways, and route selection',
  scene: 'route-selection',
  focus: 'lpm-out',
  slide: `## Route tables and route selection

**Objective:** predict where a packet goes next.

### Mental model
- A **route table** maps destinations to targets; each subnet uses one
- **local** covers the VPC's own range, always
- An **internet gateway** is the VPC's door to the internet
- The **most specific** matching route wins

### Worked example: rt-app-a
- 10.20.20.15 → **local** (the /16)
- 10.30.4.9 → **pcx-dev**: the /16 beats 0.0.0.0/0
- 198.51.100.7 → **nat-a**: only the default matches

### Misconception
- "Order in the table decides" — prefix length decides

### Explanation summary
- Longest prefix wins; the subnet's table is the whole story`,
  narration:
    "Addresses say where a packet is going; route tables say which way to send it. Every subnet is associated with one route table, a list of destination ranges and targets. Every table contains a local route for the V P C's own range, so instances in the same V P C can always reach each other's addresses. An internet gateway, attached to the V P C, is its door to the internet, and a default route, zero dot zero dot zero dot zero slash zero, pointing at it is what makes a subnet public. Look at the two tables. The public subnets send everything outside the V P C to the internet gateway. The app subnets have three routes: local, a route to the development V P C through a peering connection, which we meet in section nine, and a default route to a N A T gateway, which is the next section. When a destination matches more than one route, the most specific one wins, the one with the longest prefix. The code applies that rule. Ten dot twenty dot twenty dot fifteen, a database address, matches local. Ten dot thirty dot four dot nine matches both the slash sixteen to dev and the default route, and the slash sixteen is more specific, so it goes over the peering. The payment provider's address matches only the default, so it goes to the N A T gateway. The misconception is that the order of rows in the table decides. It does not; the prefix length decides. So to predict a packet's next hop, find the subnet's route table and pick the longest matching prefix.",
}
