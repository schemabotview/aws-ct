import type { Section } from '../types'

export const addressesAndCidr: Section = {
  id: 'addresses-and-cidr',
  title: 'IP addresses, CIDR ranges, ports, protocols, and subnet foundations',
  scene: 'cidr-plan',
  focus: 'plan-out',
  slide: `## Addresses, CIDR and ports

**Objective:** read an address range and size a subnet.

### Mental model
- An **IPv4 address** is 32 bits: 10.20.11.37
- **CIDR** /n fixes the first n bits: a /16 holds 65,536 addresses
- A **port** picks the program; **TCP/UDP** say how bytes travel
- AWS keeps **5 addresses** in every subnet

### Worked example: the shop's plan
- VPC 10.20.0.0/16 → nine **/24** subnets, three per tier
- Each /24: 256 addresses, **251** usable
- 10.20.11.37 falls in **app-b**; no ranges overlap

### Misconception
- "A bigger range is always safer" — overlaps block peering later

### Explanation summary
- Plan ranges once, check them with code, never overlap`,
  narration:
    "Before we can trace a request through a network, we need its addresses. An I P version four address is thirty two bits, written as four numbers, like ten dot twenty dot eleven dot thirty seven. A range of addresses is written in C I D R notation: an address, a slash, and a number saying how many leading bits are fixed. A slash sixteen fixes sixteen bits and leaves sixteen free, which is sixty five thousand five hundred and thirty six addresses. A slash twenty four leaves eight bits free, which is two hundred and fifty six. Addresses find a machine; ports find a program on it. H T T P S listens on four four three. Our app servers listen on eight zero eight zero, PostgreSQL on five four three two, and D N S on fifty three. T C P gives an ordered, acknowledged stream; U D P sends single packets, which is why D N S often uses it. Now the shop's plan, computed rather than asserted. The production V P C is ten dot twenty dot zero dot zero slash sixteen. The code cuts it into nine slash twenty four subnets: public, app and data tiers, one of each per Availability Zone. A W S reserves five addresses in every subnet, the first four and the last, so each slash twenty four has two hundred and fifty one usable addresses. The code also finds which subnet holds ten dot twenty dot eleven dot thirty seven, app b, and confirms that no two ranges overlap. The misconception is that a bigger range is always safer. The real risk is overlap: two networks using the same addresses can never be joined later. So plan ranges once, check them with code, and never let them overlap.",
}
