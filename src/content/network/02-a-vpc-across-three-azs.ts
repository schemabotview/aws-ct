import type { Section } from '../types'

export const aVpcAcrossThreeAzs: Section = {
  id: 'a-vpc-across-three-azs',
  title: 'A VPC across three AZs',
  scene: 'vpc-layout',
  narration:
    "Now the plan becomes a network, inside the V P C box on the map. The script on the right, infra zero five network, does it in two moves. Line five creates the V P C with the shop's range and names it shop prod. A V P C belongs to a Region, so it spans all three zones. Lines eleven and twelve are a small function that creates one subnet, in one zone, with one range and a name. A subnet, unlike its V P C, lives in exactly one zone. The function is called nine times, once per row of the plan from the last section. The terminal shows the result: the V P C's I D, then nine subnet I Ds, each with its name, its zone and its range. Every I D here is the emulator's, and stays the same on every replay. The table says what each tier is for, which is the real design decision. The public tier holds what must be reachable from the internet, the load balancer, and the NAT gateway that lets private servers reach out. The app tier holds the app servers. Each server gets a network interface, an E N I, with a private address from its subnet, like ten dot twenty dot eleven dot thirty seven in app b, and the app tier is reachable from the load balancer only. The data tier holds the orders database, reachable from the app servers only. Spreading every tier over three zones is what lets the shop lose a zone, as Course two showed, and keep serving. Nothing yet makes any of these subnets public or private. That is decided not by the subnet but by its route table. Next, route tables, and how a packet's route is chosen.",
}
