import type { Section } from '../types'

export const publicAndPrivateConnectivity: Section = {
  id: 'public-and-private-connectivity',
  title: 'Public and private connectivity: addressing, NAT, and outbound dependencies',
  scene: 'private-egress',
  focus: 'reachability',
  slide: `## Public, private and NAT

**Objective:** say who can start a connection, in which direction.

### Mental model
- **Public** = a route to the internet gateway **and** a public IP
- **Private** = no route to the internet gateway
- A **NAT gateway** lets private servers call out, never in

### Worked example: payments time out
- The order API calls api.payments.example.com → **timeout**
- rt-app-a has only **local**: no way out
- Fix: NAT gateway in public-a, then **0.0.0.0/0 → nat-a**

### Misconception
- "Public subnet = reachable" — it also needs a public IP and SG rules

### Explanation summary
- Routes and addresses decide direction; NAT is one-way`,
  narration:
    "Now an incident, the one the plan asks us to diagnose. The order A P I runs in the private app subnets, and it must call a payment provider at api dot payments dot example dot com. The call times out after five seconds. Read the route table, as the comment does: rt app a contains only the local route. There is no path out of the V P C at all, so the packets have nowhere to go, and a timeout, rather than a refusal, is the typical symptom. We do not want the app servers to be reachable from the internet, so we will not give them public addresses or a route to the internet gateway. Instead we add a N A T gateway. It sits in a public subnet, it has an Elastic I P, and it translates the private servers' outgoing connections so they appear to come from that one public address. The commands allocate the address, create the N A T gateway in public a, and add a default route from the app subnet's table to it. Replies to connections the servers started come back through the N A T; connections started from the internet cannot come in. N A T gateways are zonal by default, so one per zone keeps each zone's outbound traffic independent of the others. Now the table. A server in a public subnet with a public address can call out and be called. In a public subnet without a public address, it can do neither. Private with no N A T route, neither. Private with a N A T route, outbound only. The misconception is that putting something in a public subnet makes it reachable. It also needs a public address, and the filters in the next section must allow the traffic. Routes and addresses decide direction, and N A T only works one way.",
}
