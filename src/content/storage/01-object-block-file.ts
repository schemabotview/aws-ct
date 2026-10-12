import type { Section } from '../types'

export const objectBlockFile: Section = {
  id: 'object-block-file',
  title: 'Object, block, and file storage: interfaces, workloads, and persistence boundaries',
  scene: 'storage-kinds',
  focus: 'choice',
  slide: `## Object, block and file storage

**Objective:** match each kind of data to an interface.

### Mental model
- **Object (S3):** whole objects by key, over an API
- **Block (EBS):** a disk for one server, in one AZ
- **File (EFS):** a shared directory, mounted by many
- **Instance store:** fast, but gone when the instance stops

### Worked example: the shop's data
- Product images, exports → **S3**
- A server's scratch or build cache → **EBS**
- Invoice PDFs shared by workers → **EFS**

### Misconception
- "Storage is storage" — interface, scope and update model differ

### Explanation summary
- Ask who reads, how it changes, and what it must outlive`,
  narration:
    "Chapter four made servers disposable, which raises the obvious question: where does the data live? A W S offers three interfaces to bytes. Object storage, S three, stores whole objects under keys and is reached over an H T T P S A P I; you replace an object rather than editing bytes inside it. Block storage, E B S, is a disk attached to one server, living in one Availability Zone, where you can change any byte. File storage, E F S, is a shared directory that many servers mount over N F S at the same time. Read the table for the shop. Product images and order exports are written once and read by many, from anywhere, so they go in S three. A server's local scratch space or build cache belongs on an E B S volume. Invoice P D Fs that several workers create and read together belong on E F S. The list on the right asks the persistence question that chapter four left open. Instance store disappears when the instance stops. An E B S volume survives its instance but not the loss of its zone. S three and E F S survive the loss of a zone. The misconception is that storage is storage and only the price differs. The interface, the scope and the way updates work are different, and an application written for one does not simply work on another. So for every kind of data ask three things: who reads it, how it changes, and what it must outlive.",
}
