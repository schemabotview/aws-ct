import type { Section } from '../types'

export const operationalAccessAndInventory: Section = {
  id: 'operational-access-and-inventory',
  title: 'Operational access, Systems Manager, patching, and configuration inventory',
  scene: 'ops-access',
  focus: 'questions',
  slide: `## Operational access and inventory

**Objective:** operate servers through recorded, IAM-checked APIs.

### Mental model
- **Systems Manager**: an agent on each server, driven by APIs
- **AWS Config**: records resource settings, evaluates rules
- Both answer through IAM and leave CloudTrail records

### Worked example: the order-api fleet
- Inventory: what is installed on each server
- Patch states for the order-api patch group
- Session Manager: a recorded shell, no port 22 open
- Config rule flags any S3 bucket that allows public reads

### Misconception
- "A Config rule fixes the drift" — it reports; remediation is separate

### Explanation summary
- Ask the fleet through APIs, not by logging in`,
  narration:
    "Servers still need looking after: knowing what is installed, keeping them patched, and occasionally getting a shell. The old way was S S H keys and an open port twenty two. Systems Manager replaces that with an agent on each instance that is driven through A P I calls, so every action is authorised by I A M and recorded in CloudTrail. AWS Config does the same for configuration: it records how resources are set up and evaluates rules against them. The first card, checked against the service model, asks the order A P I fleet three things. List inventory entries shows the applications installed on one server. Describe instance patch states for patch group shows which servers in the order-api group are missing patches. And start session opens a recorded shell for an operator with no inbound port at all. The second card is a Config rule request, validated in full: the managed rule S three bucket public read prohibited, scoped to S three buckets, named s3-no-public-read. The table summarises: inventory for what software is present, Patch Manager for patching, Config rules for intended configuration, Session Manager for a shell. The misconception is that a Config rule fixes the drift it finds. It marks the resource non-compliant; fixing it is a separate remediation action that you configure or perform. So: ask the fleet through A P Is rather than logging in to look.",
}
