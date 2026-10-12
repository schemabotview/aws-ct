import type { Section } from '../types'

export const ingestionAndReconciliation: Section = {
  id: 'ingestion-and-reconciliation',
  title: 'Batch ingestion, CDC, transfer, and reconciliation choices',
  scene: 'cdc-reconcile',
  focus: 'rec-out',
  slide: `## Ingestion, CDC and reconciliation

**Objective:** land changes once each, on the right day, and prove it.

### Mental model
- **Batch** export, **CDC** of every change, or a **stream**
- Pipelines replay: expect **duplicates**
- Records arrive **late**: place them by **event** time

### Worked example: 12 Oct
- 6 records received → **4** unique orders after dedupe
- o-504 at 23:58 arrived 00:04 → still **12 Oct**
- Lake 4 orders, 756.50 = source → **reconciled**

### Misconception
- "If the job succeeded, the data is complete" — reconcile against the source

### Explanation summary
- Dedupe, place by event time, reconcile before publishing`,
  narration:
    "Getting operational data into the lake can be done in several ways, and the table lists them. A nightly batch export is simplest when yesterday is fresh enough. Change data capture, for example with the D M S task from chapter six, sends every insert and update within minutes. A stream carries events in seconds. And bulk transfer moves files from on premises. Whichever you choose, two things will happen. Records will be duplicated, because pipelines retry and replay. And records will arrive late. The program processes the twelfth of October as it actually arrived. Six records came in. Order five oh two's first change appears twice, a replay. Order five oh four's change happened at two minutes to midnight but only arrived at four minutes past, in the next batch. Deduplicating by order and sequence leaves four unique orders. Placing each by its event time, not its arrival time, keeps five oh four on the twelfth. Then the step most pipelines skip: reconciliation. The source database says four orders totalling seven hundred and fifty six pounds fifty for that day; the lake agrees, so the day is published. Had they disagreed, the day would be held back and investigated. The misconception is that a successful job means complete data. A job can succeed while missing a late file or counting a replay twice. So deduplicate, place records by event time, and reconcile against the source before anyone reads the numbers.",
}
