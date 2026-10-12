import type { Section } from '../types'

export const vpcAndSubnetLayout: Section = {
  id: 'vpc-and-subnet-layout',
  title: 'VPCs, Availability Zone placement, network interfaces, and subnet layout',
  scene: 'vpc-layout',
  focus: 'vpc',
  slide: `## VPCs and subnet layout

**Objective:** place every subnet and interface deliberately.

### Mental model
- A **VPC** is your private network in one Region
- A **subnet** is a slice of it in **one AZ**
- An **ENI** (network interface) sits in one subnet, with its IP
- Tiers are subnets: public, app, data

### Worked example: shop-prod
- 10.20.0.0/16 across AZs a, b and c
- Each AZ: public, app and data subnet
- The app-b server's ENI holds 10.20.11.37

### Misconception
- "A subnet spans the Region" — it lives in one AZ; repeat it per AZ

### Explanation summary
- One VPC per environment; one subnet per tier per AZ`,
  narration:
    "A V P C, a virtual private cloud, is your own private network inside one Region. It owns an address range, and every network resource you create lives inside it. A V P C spans all the Availability Zones of its Region, but a subnet does not. A subnet is a slice of the V P C's range placed in exactly one zone. And the thing that actually connects a server to a subnet is its elastic network interface, an E N I, which sits in one subnet and takes its private address from that subnet's range. Look at the layout for shop prod. The V P C is ten dot twenty dot zero dot zero slash sixteen, in E U west two. Each of the three zones gets three subnets, one per tier: a public subnet for the load balancer and N A T gateways, an app subnet for the order A P I servers, and a data subnet for the database. So the app server in zone b has an E N I in app b, with the address ten dot twenty dot eleven dot thirty seven from our calculation. Why tiers? Because each tier will get different routes and different filters, and those attach to subnets and interfaces. And why repeat them in every zone? Because, as we saw in chapter one, surviving the loss of a zone means having capacity in the others. The misconception is that one subnet can span the Region. It cannot; if you want a tier in three zones, you create three subnets. So: one V P C per environment, and one subnet per tier per zone.",
}
