import type { Section } from '../types'

export const encryptionAndBackup: Section = {
  id: 'encryption-and-backup',
  title: 'Encryption, key access, retention, replication, and backup trade-offs',
  scene: 'data-protection',
  focus: 'threats',
  slide: `## Encryption, replication and backup

**Objective:** match protection to the loss it stops.

### Mental model
- **SSE-KMS:** reading also needs **key** permission
- **Replication** copies writes, not deletes by default
- **Object Lock:** no deletes until retention ends
- **Backup:** a separate copy you have **restored**

### Worked example: shop-reports
- Default SSE-KMS key **alias/shop-reports**
- Versions for mistakes, Object Lock for attackers
- Isolated backups for Region loss

### Misconception
- "Replicated means backed up" — a bad write replicates too

### Explanation summary
- No restore test, no recoverability claim`,
  narration:
    "The last storage question is protection, and it is where similar sounding features are most often confused. Start with encryption. The request on the board, validated against the S three A P I, makes the shop reports bucket encrypt every new object with a K M S key, alias shop reports, and enables a bucket key to reduce key requests. With K M S, reading an object needs permission on the key as well as on the object, which adds a second, separate gate. Now the table, which crosses threats with protections. Replication copies new writes to another bucket, perhaps in another Region, so it protects against a zone or Region outage. But by default it does not replicate delete markers, and an accidental overwrite or a corrupt write replicates faithfully. Versioning protects against accidental deletes and bad overwrites, because history remains, but anyone allowed to delete versions can delete history too. Object Lock in compliance mode blocks deletion until the retention period ends, even for the root user, so it stops an attacker who has stolen credentials. A backup is a separate copy, ideally in another account or Region, that you can restore from. Notice the last row: none of these stops someone who can read the data from reading it. That is access control's job. The misconception is that replicated means backed up. A replica is a mirror, mistakes included. And the evidence for recoverability is a restore you have actually performed. Storage preserves bytes; next we examine database services that organise application state and coordinate changes.",
}
