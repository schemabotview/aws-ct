import type { Section } from '../types'

export const operationalVsAnalytical: Section = {
  id: 'operational-vs-analytical',
  title: 'Operational versus analytical data: freshness, history, and query shape',
  scene: 'state-vs-history',
  focus: 'hist-out',
  slide: `## Operational vs analytical data

**Objective:** say why analytics needs its own copy of the data.

### Mental model
- **Operational**: current state, small fast reads and writes
- **Analytical**: history, large scans, minutes-old is fine
- Path: order changes → **S3** → **catalog** → **Athena**

### Worked example: what was true at 20:00?
- Orders table now: o-501 **SHIPPED**
- History replayed to 20:00: o-501 and o-502 **PAID, not shipped**
- The current table cannot answer that question

### Misconception
- "Just query production" — big scans compete with checkout

### Explanation summary
- Keep history separately; query it without touching orders`,
  narration:
    "Everything so far served the live shop: small, fast reads and writes of the current state. Analytics asks different questions. How many orders were paid but not yet shipped at eight in the evening? What were sales by day last month? Those questions scan a lot of data, they care about history, and an answer a few minutes or hours old is usually fine. The program shows why the operational database cannot answer them. The orders table keeps only the current state: o five oh one is shipped, o five oh two is paid, o five oh three is placed. But the question was about twenty hundred. Replaying the history of changes up to that moment gives a different answer: o five oh one and o five oh two were both paid and not yet shipped, because five oh one only shipped at half past nine. The current state has overwritten that fact. So analytics keeps its own copy, built from every change. The board shows the pipeline this chapter builds: order changes flow out of the orders database into an S three data lake, a Glue catalog describes the files as tables, and Athena runs S Q L over them. The misconception is to just query production. A long scan for a report competes with checkout for the same database, at exactly the times both are busiest. Keep history separately, and query it without touching the orders database.",
}
