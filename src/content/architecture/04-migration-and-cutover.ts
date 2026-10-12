import type { Section } from '../types'

export const migrationAndCutover: Section = {
  id: 'migration-and-cutover',
  title: 'Migration, staged adoption, cutover, coexistence, and rollback boundaries',
  scene: 'staged-cutover',
  focus: 'gates-out',
  slide: `## Staged migration and cutover

**Objective:** move in steps, each with a gate and a way back.

### Mental model
- **Coexistence**: old and new paths serve together
- **Gate**: evidence checked before the next step
- **Rollback boundary**: where undo becomes a recovery

### Worked example: EC2 → ECS Fargate
- ALB weights 90/10, then 50/50, then 0/100
- Gate: 5xx no worse, and acknowledged orders = stored orders
- At 100%: 1,210 acked, 1,207 stored → roll back, replay 3
- Dropping a column ends rollback: then it is a restore

### Misconception
- "We can always roll back" — not past a data change

### Explanation summary
- Reconcile at every step; know where undo stops`,
  narration:
    "The decision record chose E C S Fargate, so the order A P I has to move there from E C two without stopping the shop. A staged migration lets old and new paths coexist, checks evidence at a gate before each step, and knows its rollback boundary, the point where undoing a step stops being a switch and becomes a recovery. The request on the card, validated against the load balancer's service model, changes the listener's default action to forward ninety percent of requests to the existing E C two target group and ten percent to the new E C S one. The program applies the gate at each stage, with illustrative counts and real arithmetic. A step proceeds only if the new path's five hundred error rate is no worse than the old, and the orders the A P I acknowledged equal the orders stored in the database. At ten percent: point oh five percent errors, one thousand two hundred and four acknowledged and stored, proceed. At fifty percent: point oh six percent, one thousand one hundred and ninety eight both, proceed. At one hundred percent, the error rate is fine, but one thousand two hundred and ten orders were acknowledged and only one thousand two hundred and seven stored. The gate rolls back: the weight goes back to E C two, the three missing orders are replayed, and the cause is found before trying again. Error rates alone would have missed it. The table marks the boundaries. Traffic weights roll back by changing a weight. Keeping the E C two group warm for seven days keeps that option open. Expanding the schema with a nullable column is safe, because old code ignores it. Contracting it, dropping the old column, is where rollback ends: undoing it means a restore. The misconception is that you can always roll back; not past a data change. So: reconcile at every step, and know where undo stops.",
}
