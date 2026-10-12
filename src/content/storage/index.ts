import type { Course } from '../types'
import { objectBlockFile } from './01-object-block-file'
import { s3AccessPaths } from './02-s3-access-paths'
import { s3ConsistencyAndConcurrency } from './03-s3-consistency-and-concurrency'
import { versioningAndLifecycle } from './04-versioning-and-lifecycle'
import { ebsAndSnapshots } from './05-ebs-and-snapshots'
import { sharedFileStorage } from './06-shared-file-storage'
import { encryptionAndBackup } from './07-encryption-and-backup'

// Chapter 5 of AWS-COURSE-PLAN.md — 7 of 7 sections, one scene each.
//
// Objective: Choose storage according to access semantics, durability requirements, recovery needs, and
// cost.
//
// Worked illustrations (from the plan): an annotated S3 upload and presigned-access sequence (§2
// `presigned-upload`, a real SigV4 signature); two writers replacing the same key (§3, moto); a
// version/delete-marker timeline (§4, moto); a detached volume and snapshot restore (§5, moto); a
// storage-choice table (§1). General-purpose buckets throughout. Strong consistency is explained without
// implying multi-object transactions (§3); replication, version history, retention protection and
// backups are distinguished (§7).
//
// Outcome: Justify an object/block/file choice, explain its access and lifecycle assumptions, and
// identify what evidence is needed to claim recoverability.
//
// Bridge: Storage preserves bytes; next we examine database services that organise application state and
// coordinate changes. (Spoken as the last line of §7's narration.)
export const storage: Course = {
  id: 'storage',
  title: 'Storage and the Data Lifecycle',
  sections: [
    objectBlockFile,
    s3AccessPaths,
    s3ConsistencyAndConcurrency,
    versioningAndLifecycle,
    ebsAndSnapshots,
    sharedFileStorage,
    encryptionAndBackup,
  ],
}
