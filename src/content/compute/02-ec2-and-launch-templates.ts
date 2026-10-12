import type { Section } from '../types'

export const ec2AndLaunchTemplates: Section = {
  id: 'ec2-and-launch-templates',
  title: 'EC2 instances, AMIs, launch templates, and lifecycle transitions',
  scene: 'launch-template',
  focus: 'template',
  slide: `## EC2, AMIs and launch templates

**Objective:** describe an app server so it can be recreated exactly.

### Mental model
- An **AMI** is the disk image an instance boots from
- A **launch template** pins AMI, type, role, network and settings
- States: **pending → running → stopped / terminated**

### Worked example: order-api v14
- AMI + **m7g.large** + instance profile **OrderApi**
- **IMDSv2 required**; joins **sg-app**; tagged App, Env
- Each change is a **new version**, not an edit to a server

### Misconception
- "Stop is a cheap restart" — stopped volumes still bill; terminated is gone

### Explanation summary
- Servers are copies of a template; fix the template`,
  narration:
    "If capacity must come and go, every server has to be reproducible. Two pieces make that possible. An A M I, an Amazon Machine Image, is the disk image an instance boots from. A launch template records everything else about how to start one. On the left is the order A P I's template, validated against the E C two A P I. It names the A M I and the instance type, m seven g large. It attaches the instance profile from chapter two, OrderApi, so the app gets temporary credentials with least privilege from the very first boot. It requires I M D S version two, the token based metadata service. It places the server in the app security group, carries a first boot script as user data, and tags every instance with its app and environment. When something changes, we create a new template version, here version fourteen for release one point four point two, rather than editing a running server. On the right is an instance's life. It starts pending, becomes running, and is billed per second while it runs. Stopping keeps its volumes, which are still billed, as we saw in chapter one. Terminating deletes it for good; a terminated instance cannot be started again. The misconception is that stopping is a cheap restart. A stopped instance keeps costing for its storage, and on start it may land on different hardware. So treat servers as copies of a template, and fix the template, never the copy.",
}
