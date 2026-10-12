import type { Section } from '../types'

export const policyEvaluation: Section = {
  id: 'policy-evaluation',
  title: 'Policy evaluation: implicit deny, explicit deny, and effective permission boundaries',
  scene: 'evaluation-flow',
  focus: 'matrix',
  slide: `## How a request is decided

**Objective:** predict allow or deny, and say why.

### Mental model
- Default: **deny** — nothing is allowed until something allows it
- **Explicit Deny** in any applicable policy wins, always
- Otherwise an **Allow** is needed: identity or resource policy
- Boundaries, SCPs, session policies only **cap**; they never allow

### Worked example: add DenyDrafts
- Drafts match ReadProducts **and** DenyDrafts → **Deny**
- private/costs.csv: no statement matches → implicit deny
- The error message names the deciding policy type

### Misconception
- "Allow beats Deny if it is more specific" — Deny wins

### Explanation summary
- Deny wins; then something must allow`,
  narration:
    "With statements in hand, we can predict any decision. Start from the default: every request is denied unless something allows it. Then A W S gathers every policy that applies to the request. If any of them contains an explicit deny that matches, the answer is deny, full stop. If not, at least one allow must match, from an identity policy or a resource policy. And some policy types only cap the result. A permissions boundary, an organization's service control policy, or a session policy can take permissions away, but none of them can grant anything on its own. Let's test it. We add one statement to the order A P I's policy, DenyDrafts, which denies get object on anything under products slash drafts. Now read the matrix. Product one thousand and one is allowed by ReadProducts. The draft product two thousand matches ReadProducts too, but it also matches DenyDrafts, and the deny wins. Private slash costs dot c s v matches no statement at all, so it is an implicit deny. Putting an object is an implicit deny as well, because nothing allows put object. Sending an order event is allowed. These outcomes were checked by running the requests in an emulator with this exact policy. When a real request is denied, the error message names the type of policy that decided, for example an explicit deny in an identity based policy, which tells you where to look. The misconception is that a more specific allow can beat a broader deny. It cannot. Deny wins, and only then does something have to allow.",
}
