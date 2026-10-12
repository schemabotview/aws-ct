import type { Section } from '../types'

export const wellArchitectedReview: Section = {
  id: 'well-architected-review',
  title: 'Integrated Well-Architected review and priorities for improvement',
  scene: 'well-architected-review',
  focus: 'ranked-out',
  slide: `## A Well-Architected review

**Objective:** review all six pillars together, and rank the fixes.

### Mental model
- **Six pillars**: operations, security, reliability,
  performance, cost, sustainability
- Each claim needs **evidence**, not a checklist tick
- **Rank** findings by likelihood × impact ÷ effort

### Worked example: the shop's review
- Top: rotation breaks cached passwords; alarm lacks a runbook
- Next: restore the cross-Region copy; route S3 off NAT
- Last: multi-Region active/active — no requirement asks
- Scores are the reviewers' judgement, written down

### Misconception
- "Follow the reference architecture" — fix your measured gaps

### Explanation summary
- Improve in ranked steps, each backed by evidence`,
  narration:
    "The last step is to review the whole design at once, using the A W S Well-Architected Framework's six pillars: operational excellence, security, reliability, performance efficiency, cost optimisation and sustainability. Reviewing them together matters, because a change for one pillar often costs another. The table lists the evidence this course produced for each: infrastructure as code, change sets and runbooks for operations; roles, key policies and session revocation for security; the A Z reserve, the restore drill and disaster recovery for reliability; the latency model and edge caching for performance; tags, anomalies and total cost for cost; and idle capacity, data movement and retention for sustainability. A review then produces findings, and the program ranks them by likelihood times impact divided by effort. Those scores are the reviewers' judgement, written down beside the evidence; the program only orders them. At the top, at four: password rotation breaking cached connections, and the paging alarm having no runbook link. At three: the cross-Region backup copy has never actually been restored, S three and DynamoDB traffic goes through NAT, two percent of cost is untagged, and application logs never expire. At two, the latency tail near saturation. And last, at one, going multi-Region active active: no requirement asks for it, and the previous sections showed the failure modes it would add. The misconception is that the goal is to match a reference architecture. The goal is to close this workload's measured gaps, in order. So: improve in ranked steps, each backed by evidence. Continue through optional implementation and operational practice, current service documentation, architecture reviews, and specialist study. Real production responsibility requires demonstrated deployment, security, incident, and recovery competence beyond following the course's worked explanations.",
}
