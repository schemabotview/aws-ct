import type { Section } from '../types'

export const versioningAndLifecycle: Section = {
  id: 'versioning-and-lifecycle',
  title: 'Versioning, lifecycle rules, storage classes, and retrieval implications',
  scene: 'version-timeline',
  focus: 'versions-out',
  slide: `## Versioning, lifecycle and storage classes

**Objective:** keep history, age data cheaply.

### Mental model
- **Versioning:** overwrites keep old versions
- A delete adds a **marker**; remove it to undo
- **Lifecycle rules** expire and move data

### Worked example (emulated)
- 2 versions, 1 delete → NoSuchKey; **2 kept**
- Remove the marker → **price 10.0** back
- Rule: old versions expire at **30 days**
- Exports: Standard-IA at 30 days, Glacier at 90

### Misconception
- "Glacier is cheap S3" — minimums, slow restores

### Explanation summary
- History by versioning; lifecycle sets how long`,
  narration:
    "Versioning changes what overwrite and delete mean. With versioning on, an overwrite keeps the previous version, and a delete without a version I D does not remove anything; it adds a delete marker on top. Follow the emulated timeline. We write the product at twelve, then at ten, then delete it. A plain get now returns no such key, so to applications the object is gone. But listing the versions shows one delete marker and both versions still kept. Removing the delete marker itself, by its version I D, undoes the delete, and the latest version, price ten, is back. That history is not free. Every old version is stored and billed, which is where lifecycle rules come in. The rule on the right, validated against the S three A P I, expires noncurrent versions after thirty days. A second rule ages the order exports: to Standard Infrequent Access after thirty days, and to Glacier Flexible Retrieval after ninety. Storage classes trade price for conditions. Infrequent Access charges per retrieval and has a thirty day minimum. Glacier Instant Retrieval and Flexible Retrieval have ninety day minimums, and Deep Archive one hundred and eighty. Flexible Retrieval and Deep Archive also need a restore before you can read, taking minutes to hours, or up to two days for Deep Archive. The misconception is that Glacier is simply cheaper S three. It is cheaper storage with minimum durations and slower, paid retrieval. Versioning is your history; lifecycle decides how long you keep it and where it lives.",
}
