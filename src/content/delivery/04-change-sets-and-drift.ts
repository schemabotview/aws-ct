import type { Section } from '../types'

export const changeSetsAndDrift: Section = {
  id: 'change-sets-and-drift',
  title: 'Change sets, replacement implications, drift, and review limitations',
  scene: 'change-sets',
  focus: 'replace-out',
  slide: `## Change sets, replacement and drift

**Objective:** spot a change that will replace a resource.

### Mental model
- A **change set** previews what an update would do
- **Create-only** properties force **replacement**: a new resource
- **Drift**: changes made outside the stack

### Worked example: v14 → v15, from AWS's schemas
- RDS DBInstanceClass, BackupRetentionPeriod → update in place
- RDS **StorageEncrypted** → **REPLACE**
- SQS **QueueName** → **REPLACE**: a new URL

### Misconception
- "The change set passed, so the deploy will" — it is a preview only

### Explanation summary
- Read for replacements; detect drift before you deploy`,
  narration:
    "Before updating a stack, CloudFormation can create a change set: a preview listing each resource that would be added, modified or removed, and whether a modification happens in place or by replacement. Replacement is the line to look for. It means CloudFormation creates a new resource with a new identity, points the stack at it, and deletes the old one. For a queue, that is a new U R L every consumer must learn. For a database, it is a new, empty database unless you move the data yourself. Which properties force replacement is not folklore; it is in A W S's resource provider schemas, as create only properties. The program reads those official schemas, bundled with cfn lint, and predicts the outcome of the shop's version fifteen template. Changing the database's instance class or its backup retention updates the instance in place, although some in place changes still interrupt service briefly. Turning on storage encryption replaces the database. Renaming the queue replaces the queue. The table sets out the limits. A change set tells you which resources change, and how. It does not tell you whether the update will succeed: a quota, a name already in use, a missing permission or a service error can still fail it. It says nothing about your data. And it cannot see changes someone made by hand in the console; that is drift, and drift detection compares live resources with the template. The misconception is that a change set that previews cleanly guarantees a clean deployment. It is a preview. Read it for replacements, and detect drift before you deploy.",
}
