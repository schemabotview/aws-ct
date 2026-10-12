import type { Section } from '../types'

export const rollbackAndStatefulResources: Section = {
  id: 'rollback-and-stateful-resources',
  title: 'Rollback, deletion/update policies, and protection of stateful resources',
  scene: 'rollback-and-protection',
  focus: 'events',
  slide: `## Rollback and stateful resources

**Objective:** protect data from the stack's own operations.

### Mental model
- A failed update **rolls the stack back** to its last good state
- **DeletionPolicy** / **UpdateReplacePolicy**: keep a snapshot
- **DeletionProtection**: refuse deletes, even from the API

### Worked example: v15 fails at 18:41
- The service never stabilises → **UPDATE_ROLLBACK_COMPLETE** (v14)
- The schema migration ran at 18:40:20 — **still applied**
- orders-db: snapshot on delete or replacement, deletes refused

### Misconception
- "Rollback undoes everything" — not data, and not side effects

### Explanation summary
- Set policies explicitly; make migrations backward compatible`,
  narration:
    "Updates fail. When one does, CloudFormation rolls the stack back to the last version that worked. Read the illustrative events. At eighteen forty, version fifteen starts updating. The queue updates. The order A P I service never becomes stable, because its new tasks fail their health checks, so its update fails. CloudFormation rolls the stack back and, a few minutes later, version fourteen is restored. That sounds like a complete undo, and it is not. At eighteen forty and twenty seconds, the new release's schema migration added a column to the orders database. Rollback restores resources and their configuration; it does not reverse what the application did to data, emails it sent, or payments it took. So the database needs protection from the stack itself. The template, linted with cfn lint, sets the deletion policy and the update replace policy to snapshot, explicitly: if the stack is deleted, or the database is replaced, CloudFormation snapshots it first. The update replace policy defaults to delete, which is exactly the trap from the previous section, where enabling encryption would replace the database. Deletion protection adds a second lock: R D S refuses delete requests, whoever sends them. The misconception is that rollback undoes everything. It undoes the stack. So set protection policies explicitly on every stateful resource, and make schema changes backward compatible, so the old version still works if the new one is rolled back.",
}
