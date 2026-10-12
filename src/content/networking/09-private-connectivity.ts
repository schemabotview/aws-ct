import type { Section } from '../types'

export const privateConnectivity: Section = {
  id: 'private-connectivity',
  title: 'VPC endpoints, peering/transit choices, VPN, and Direct Connect boundaries',
  scene: 'private-connectivity',
  focus: 'options',
  slide: `## Endpoints, peering, VPN, Direct Connect

**Objective:** pick a private path, and know its limits.

### Mental model
- **Endpoints** reach AWS services without the internet
- **Peering** joins two VPCs; **transit gateway** joins many
- **VPN** and **Direct Connect** join your offices to AWS

### Worked example: catalogue reads
- App servers read S3 via the NAT gateway today
- A **gateway endpoint** for S3: a route, no endpoint fee
- Its policy: only the shop's buckets

### Misconception
- "Direct Connect is encrypted" — not by default; add MACsec or a VPN

### Explanation summary
- Each path has a boundary: transitivity, cost, encryption`,
  narration:
    "The last piece of the network is private paths. Today, when the app servers read product files from S three, the traffic leaves through the N A T gateway, as if S three were any other internet service. A V P C endpoint gives it a private path instead. A gateway endpoint for S three adds a route to the subnet's table pointing at S three's address list, and it has no endpoint charge. Its endpoint policy, on the board, limits it to the shop's buckets, so the endpoint cannot be used to copy data somewhere else. It was checked against the I A M action and resource reference. Interface endpoints do the same for many other services, by placing a network interface in your subnet, with an hourly charge. Connecting networks to each other is next in the table. V P C peering joins exactly two V P Cs, like our route to the development V P C, and it is not transitive: if A peers with B and B with C, A still cannot reach C through B. A transit gateway is a hub for many V P Cs. To reach the shop's office network, a Site-to-Site V P N runs I P sec over the internet, with two tunnels per connection, and Direct Connect provides a private, dedicated link. The misconception is that Direct Connect is encrypted. It is private, but it is not encrypted by default; you add MACsec on supported links, or run a V P N over it. Every path has a boundary, whether transitivity, cost or encryption. With request paths established, next we choose where application processing runs and how capacity changes.",
}
