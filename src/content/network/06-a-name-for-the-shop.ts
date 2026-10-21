import type { Section } from '../types'

export const aNameForTheShop: Section = {
  id: 'a-name-for-the-shop',
  title: 'A name for the shop',
  scene: 'dns-resolution',
  narration:
    "Shoppers type shop dot example dot com, not an address, and on the map Route fifty three now lights up. The file at the top right is the change the shop asks Route fifty three to make. It is an upsert, meaning create or replace, of an A record for shop dot example dot com. Instead of addresses, it holds an alias target: the load balancer's D N S name in E U west two, and the hosted zone that A W S uses for application load balancers in that Region. Evaluate target health is true, so Route fifty three can stop answering with an unhealthy target. In the terminal, infra zero five d n s creates the hosted zone for example dot com, applies the change, whose status comes back in sync, and lists the A records: shop dot example dot com, aliased to the load balancer. The table follows one lookup. The shopper's resolver asks the dot com servers who holds example dot com, and is sent to Route fifty three's name servers for the zone. Route fifty three answers the alias with the load balancer's current addresses, which can change as the load balancer scales, and an alias always follows them, which a fixed address could not. The shopper then connects to one of those addresses on port four four three. The list names the routing policies beyond simple. Weighted splits answers by percentage, which Course thirteen uses to move traffic during a migration. Failover answers with a standby when a health check fails. Latency answers with the Region nearest the shopper. Next, the connection that follows the lookup, and where it is encrypted.",
}
