import type { Section } from '../types'

export const accountsAndFirstSession: Section = {
  id: 'accounts-and-first-session',
  title: 'Accounts, root-user protection, MFA, and a first federated or temporary session',
  scene: 'first-session',
  focus: 'caller',
  slide: `## Accounts and a first session

**Objective:** work without root or long-term keys.

### Mental model
- **Account:** resources, one bill, a permission boundary
- **Root user:** MFA, locked away, root-only tasks
- **IAM Identity Center:** one sign-in → **temporary** role credentials

### Worked example: alex joins dev
- Account **444455556666**, role **ShopDeveloper**
- \`aws sso login\` — browser sign-in with MFA
- STS: an **assumed role**, not a stored key
- Session: **1 h** by default, up to 12 h

### Misconception
- "A key in a file is simpler" — it never expires

### Explanation summary
- Root locked away; people get short sessions`,
  narration:
    "Before we create anything, we need a safe way in. An A W S account is a container: it holds resources, it receives one bill, and it draws a boundary around permissions. Every account has a root user, the email address that created it, and the root user can do everything, including closing the account. So we protect it with multi factor authentication, which A W S now enforces for root users, and we use it only for the handful of tasks that truly need it. Organizations can go further and remove root credentials from member accounts entirely. Daily work happens through I A M Identity Center instead. Follow alex, a developer joining the shop's development account. On the left is alex's configuration. It names the sign-in portal, the account, four four four four, five five five five, six six six six, and the role called ShopDeveloper. Running a w s s s o login opens a browser, where alex enters a password and an M F A code. Then a w s s t s get caller identity asks the Security Token Service a simple question: who am I? Look at the answer. The A R N says assumed role. Alex is not a user with a stored key; alex is holding temporary credentials for a role, and by default that role session lasts one hour, configurable up to twelve, before it must be renewed. The misconception is that an access key in a file is simpler. It is simpler, until it leaks. A long-term key never expires, and it works for whoever finds it. Temporary credentials expire on their own. So the pattern is: root locked away, and people working through one sign-in that hands out short sessions.",
}
