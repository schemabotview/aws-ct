import type { Course } from '../types'
import { objectBlockAndFile } from './01-object-block-and-file'
import { theCatalogBucket } from './02-the-catalog-bucket'
import { uploadsWithoutCredentials } from './03-uploads-without-credentials'
import { twoWritersOneKey } from './04-two-writers-one-key'
import { versionsAndLifecycle } from './05-versions-and-lifecycle'
import { volumesAndSharedFiles } from './06-volumes-and-shared-files'
import { encryptionReplicationAndBackup } from './07-encryption-replication-and-backup'

// Course 8 — Store its files. Object, block and file; the declared catalog bucket; presigned
// uploads; conditional writes; versions and lifecycle; EBS snapshots and EFS; SSE-KMS and what each
// protection protects against.
export const files: Course = {
  id: 'files',
  title: 'Store its files',
  sections: [objectBlockAndFile, theCatalogBucket, uploadsWithoutCredentials, twoWritersOneKey, versionsAndLifecycle, volumesAndSharedFiles, encryptionReplicationAndBackup],
}
