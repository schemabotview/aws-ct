import type { Section } from '../types'

export const securityGroupsAndNacls: Section = {
  id: 'security-groups-and-nacls',
  title: 'Security groups and network ACLs: state, rule scope, and traffic filtering',
  scene: 'traffic-filters',
  focus: 'chain',
  slide: `## Security groups and network ACLs

**Objective:** filter each tier to exactly the traffic it needs.

### Mental model
- **Security group:** on an interface; allow rules; **stateful**
- **Network ACL:** on a subnet; allow and deny; **stateless**, in order
- A rule can name **another security group** as the source

### Worked example: the tier chain
- sg-alb: **443** from anywhere
- sg-app: **8080** only from sg-alb
- sg-db: **5432** only from sg-app

### Misconception
- "A route means traffic flows" — filters must also allow it

### Explanation summary
- Routes say where; filters say whether`,
  narration:
    "Routes decide where a packet can go. Filters decide whether it is allowed. A W S gives us two. A security group is attached to a network interface. It contains only allow rules, all of them considered together, and it is stateful: if a request is allowed in, its reply is allowed out automatically. A network A C L is attached to a subnet. It has both allow and deny rules, evaluated in order from the lowest rule number, first match wins, and it is stateless, so the reply needs its own rule, usually on the client's ephemeral ports. Most designs do their real filtering with security groups, and here is the shop's chain. The load balancer's group, s g a l b, allows port four four three from anywhere, because shoppers are anywhere. The app servers' group allows port eight zero eight zero, but only from s g a l b. Notice the source is not an address range; it is another security group, meaning any interface carrying that group. When the load balancer adds nodes, the rule still fits. The database group allows five four three two only from the app group. The request in the middle is exactly that app rule, validated against the E C two A P I. So the database cannot be reached even by something else inside the V P C that is not an app server. The misconception is that a route means traffic flows. A route is necessary, but every filter on the way, security groups and network A C Ls, in both directions where they are stateless, must also allow it. Routes say where; filters say whether.",
}
