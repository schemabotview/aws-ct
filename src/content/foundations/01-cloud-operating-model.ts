import type { Section } from '../types'

export const cloudOperatingModel: Section = {
  id: 'cloud-operating-model',
  title: 'On-demand resources, managed services, elasticity, and the cloud operating model',
  scene: 'product-page',
  focus: 'app',
  slide: `## The cloud operating model

**Objective:** what changes when servers are API calls.

### Mental model
- **On demand** — create a server, database or bucket by API; pay while it exists
- **Managed service** — AWS runs part of the stack: the load balancer, the database engine
- **Elasticity** — capacity follows demand, up and back down

### Worked example: one day of demand
- One app server handles **150 req/s**; demand is 60, 240, then **560** req/s
- Sized for the peak: **4 × 24 h = 96** server-hours
- Elastic: 1 × 8 h + 2 × 10 h + 4 × 6 h = **52** — 46% fewer

### Misconception
- "The cloud scales by itself" — **you** set the rules; new servers take minutes

### Explanation summary
- AWS removes the hardware purchase; design, configuration and cost stay yours`,
  narration:
    "Let's start with the application we will follow through the whole course: a small online shop. A shopper opens the page for product p one thousand and one. The browser asks Route fifty three, the D N S service, for the shop's address, then sends an H T T P S request to a load balancer. The load balancer passes it to one of our app servers, which reads the product from the orders database and links to its image in object storage. Three ideas sit inside that picture. First, every one of those resources is on demand. We create it with an A P I call, and we pay while it exists, not for a machine we bought. Second, some of them are managed services. We never patch the load balancer, and A W S runs the database engine; we only configure them. Third, elasticity. Look at the chart. One app server handles a hundred and fifty requests a second. Overnight, demand is sixty. During the day it is two hundred and forty, and on a sale evening it reaches five hundred and sixty. If we size for the peak, we run four servers all day, which is ninety six server hours. If capacity follows demand, we run one server for eight hours, two for ten, and four for six, which is fifty two server hours, about forty six percent fewer. Now the misconception. The cloud does not scale by itself. You write the scaling rules, a new server takes minutes to be ready, so the evening rise must be anticipated, and account quotas put a ceiling on how many you can start. So the operating model changes who buys hardware, but you still own the design, the configuration, and the bill.",
}
