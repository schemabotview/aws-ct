import type { Section } from '../types'

export const guardrailsAndAudit: Section = {
  id: 'guardrails-and-audit',
  title: 'Guardrails, SCP/RCP boundaries, delegated administration, and audit ownership',
  scene: 'guardrails',
  focus: 'policy-kinds',
  slide: `## Guardrails and audit ownership

**Objective:** limits no account can exceed.

### Mental model
- **SCP**: the most principals in member accounts can do
- **RCP**: the most anyone can do to resources in them
- Neither **grants**; neither affects the management account
- **Delegated admin**: a member account runs security

### Worked example: Workloads OU guardrails
- SCP: deny outside **eu-west-2**, except global
- RCP: no S3 access from **outside the org**
- RCPs launched for S3, STS, KMS, SQS, Secrets Manager
- Audit account: delegated admin; collects the org's logs

### Misconception
- "An SCP grants prod access" — roles need an Allow

### Explanation summary
- Guardrails cap; identity and resource policies grant`,
  narration:
    "The last layer is guardrails: limits set once, at the organization, that no account can exceed. There are two kinds. A service control policy, an S C P, limits what principals in member accounts can do. A resource control policy, an R C P, limits what anyone can do to resources in member accounts, whoever the caller is. Neither of them ever grants a permission, and neither affects the management account, which is one more reason to keep that account almost empty. On the left is an S C P attached to the Workloads O U. It denies every action outside E U west two, except the listed global services such as I A M, Route fifty three and CloudFront, which are not tied to our Region. On the right is an R C P. It denies any S three access by principals outside our organization, unless an A W S service is acting for us. Even if someone later writes a bucket policy that opens a bucket to the world, this guardrail still blocks outsiders. R C Ps launched for S three, S T S, K M S, S Q S and Secrets Manager, and have since added services, so check the current list. The table puts every policy type in one place: only identity and resource policies grant; boundaries, S C Ps and R C Ps only limit. Finally, ownership of the audit trail. Rather than run security tools from the management account, a member account, our audit account, is made the delegated administrator for services such as GuardDuty and Security Hub, and it collects the organization's logs. The misconception is that an S C P gives production its permissions. It does not; roles still need an allow. Guardrails cap, and only identity and resource policies grant. Authorisation still says nothing about whether a request can reach its target, so next we trace the network paths requests must travel.",
}
