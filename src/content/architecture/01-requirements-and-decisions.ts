import type { Section } from '../types'

export const requirementsAndDecisions: Section = {
  id: 'requirements-and-decisions',
  title: 'Requirements, constraints, alternatives, and architecture decision records',
  scene: 'decision-record',
  focus: 'requirements',
  slide: `## Decisions you can revisit

**Objective:** connect each choice to a requirement, in writing.

### Mental model
- **Requirement**: a measurable need, e.g. RPO 15 min
- **Constraint**: a fixed condition — the team, PostgreSQL
- **ADR**: context, decision, rejected options, consequences

### Worked example: the order platform
- Lambda + DynamoDB rejected: reports need PostgreSQL
- EKS rejected: the team has no Kubernetes skills
- EC2 meets all hard needs, but the team patches the OS
- ECS Fargate accepted; revisit if peak grows 5×

### Misconception
- "There is a best architecture" — only a best fit

### Explanation summary
- Write down what was rejected and when to revisit`,
  narration:
    "This final chapter puts the course together: a whole architecture for the shop, the reasons behind it, and how it changes. A design starts with requirements, which are measurable needs: five hundred and sixty requests a second at the evening peak with a ninety ninth percentile under three hundred milliseconds, surviving the loss of an Availability Zone, losing at most fifteen minutes of data and recovering within ninety. Constraints are conditions you do not get to change: the reports and the change data capture pipeline read PostgreSQL, and the team is three people. The table checks four candidate platforms against each hard requirement, using evidence from earlier chapters. All four can meet the load, the zone failure and the recovery targets. Lambda with DynamoDB fails one: it would mean rewriting the order transaction and everything that reads PostgreSQL. E K S fails another: the team has no Kubernetes skills. E C two with Auto Scaling meets every hard requirement but leaves operating system patching with the team, which the last row records. That leaves E C S on Fargate. The card below is an architecture decision record, illustrative in its wording: the context, the decision, each rejected option with its reason, the consequences, such as an image pipeline, task roles and no S S H, and the condition for revisiting it: a peak five times larger, or dropping PostgreSQL. The misconception is that there is a best architecture. There is only one that fits a given set of requirements and constraints, and it changes when they do. So: write down what was rejected, and when to look again.",
}
