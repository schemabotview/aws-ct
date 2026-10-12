import type { Section } from '../types'

export const organizationsAndIsolation: Section = {
  id: 'organizations-and-isolation',
  title: 'Accounts, organisational units, AWS Organizations, and environment isolation',
  scene: 'org-structure',
  focus: 'org',
  slide: `## Organizations and environment isolation

**Objective:** use accounts as walls between environments.

### Mental model
- An **account** is the strongest boundary AWS offers
- **Organizations** groups accounts; a **management** account runs it
- **OUs** group accounts so policies attach once
- One **consolidated bill**, costs still per account

### Worked example: the shop's organization
- Security OU: the **audit** account
- Workloads OU: **Prod** and **Dev** OUs, one account each
- A dev mistake cannot delete prod: different account

### Misconception
- "Tags and names separate dev from prod" — they are labels, not walls

### Explanation summary
- One account per environment; group them with OUs`,
  narration:
    "Inside one account, separating development from production depends on every policy being written perfectly. Accounts give a stronger boundary. Resources, permissions and service quotas all belong to an account, so an account is the hardest wall A W S offers. A W S Organizations groups accounts together. One account, the management account, creates the organization; it should do little else. Accounts are placed in organisational units, O Us, which can be nested, and policies attach to an O U once and apply to every account below it. The whole organization pays one consolidated bill, while costs remain visible per account. Here is the shop's structure. At the root sits the management account. A Security O U holds the audit account, which will collect logs and run security tools. A Workloads O U contains two O Us, Prod and Dev, each with one account. Now read the table of what this separates. Permissions: an administrator in dev has no rights in production unless production grants them. Resources: a script that deletes every bucket it can see in dev cannot see production's buckets. Quotas: a load test in dev cannot use up production's limits. Bills: each account's cost is visible on its own. The misconception is that tags or naming conventions separate environments. Tags are labels; a policy mistake crosses them easily. Accounts are walls. So give each environment its own account, and group them with O Us.",
}
