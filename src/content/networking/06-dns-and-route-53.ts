import type { Section } from '../types'

export const dnsAndRoute53: Section = {
  id: 'dns-and-route-53',
  title: 'DNS resolution and routing choices with Route 53',
  scene: 'dns-resolution',
  focus: 'record',
  slide: `## DNS and Route 53

**Objective:** follow a name to an address, and choose how it answers.

### Mental model
- A **resolver** asks root → .com → the zone, then caches for the **TTL**
- A **hosted zone** holds a domain's records in Route 53
- An **alias** record points at an AWS resource, such as a load balancer
- A **routing policy** chooses between answers

### Worked example: shop.example.com
- UPSERT an **alias A** record → the load balancer
- EvaluateTargetHealth: answer only if healthy

### Misconception
- "A DNS change is instant" — resolvers keep cached answers until the TTL ends

### Explanation summary
- Names are cached pointers; plan changes around TTLs`,
  narration:
    "Shoppers do not type addresses; they type shop dot example dot com. D N S turns that name into an address. The browser asks a recursive resolver, usually run by the shopper's network. If the resolver has no cached answer, it asks the root servers, then the dot com servers, and finally the authoritative servers for example dot com. Ours is a Route fifty three public hosted zone, the container for the domain's records. The answer comes back with a time to live, a T T L, and the resolver caches it for that long. The record on the right is how we publish the shop. It is an upsert, create or replace, of an A record for shop dot example dot com. But instead of a fixed address, it is an alias: it points at the load balancer's D N S name, and Route fifty three answers with the load balancer's current addresses, which can change. Evaluate target health means Route fifty three will consider whether the target is healthy. This request was validated against the Route fifty three A P I; the zone identifiers are placeholders. Below it are the routing policies, which decide which answer to give when there is more than one: simple, weighted, for sending ten percent of users to a new version, latency, failover to a secondary, and geolocation. The misconception is that a D N S change takes effect at once. Resolvers all over the world keep the old answer until its T T L expires. So treat names as cached pointers, and plan changes around their T T Ls.",
}
