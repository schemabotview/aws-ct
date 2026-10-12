import type { Section } from '../types'

export const incidentTriageAndContainment: Section = {
  id: 'incident-triage-and-containment',
  title: 'Incident triage, containment, ownership, and runbook reasoning',
  scene: 'incident-containment',
  focus: 'sequence',
  slide: `## Incident triage and containment

**Objective:** follow a plausible sequence from finding to fix.

### Mental model
- **Triage**: how bad, how wide, who leads
- **Contain**: stop the damage before full understanding
- **Preserve, eradicate**: keep evidence, remove the cause

### Worked example: stolen OrderApi keys
- 18:19 GuardDuty: keys used from 198.51.100.66
- 18:21 one incident lead owns the response
- 18:24 Deny all for sessions issued before 18:20
- 18:30 keep CloudTrail records, snapshot volumes
- 19:10 find and fix the leak, redeploy

### Misconception
- "Delete the role" — loses evidence, breaks the app

### Explanation summary
- Contain narrowly, keep the evidence, then fix the cause`,
  narration:
    "When a finding does arrive, a sequence is better than improvisation, and this one is a plausible example rather than a recorded incident. At eighteen nineteen GuardDuty reports that the OrderApi role's temporary credentials are being used from an address outside A W S, one nine eight dot five one dot one hundred dot six six. Triage asks how bad and how wide, and at eighteen twenty one one person is named incident lead, so decisions have an owner. At eighteen twenty four the lead contains it. The stolen credentials are temporary, but they stay valid until they expire, so the runbook attaches the policy on the right to the role: deny every action for any session whose token was issued before eighteen twenty. This is the documented way to revoke active role sessions, and parliament checks its condition key. Servers simply fetch fresh credentials and carry on; the stolen ones stop working. At eighteen thirty the evidence is preserved: CloudTrail records retained and the instance's volumes snapshotted. At nineteen ten, eradication: find how the credentials leaked, fix it and redeploy. Notice that the finding notified and people acted, with a runbook to guide them. The misconception is that deleting the role is the safe response. It destroys evidence of what the role did and takes the order A P I down with it. So: contain narrowly, keep the evidence, then fix the cause.",
}
