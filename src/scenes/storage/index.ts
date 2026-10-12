import type { Scene } from '@graphlearning/flow'
import { storageKinds } from './storage-kinds'
import { presignedUpload } from './presigned-upload'
import { concurrentWriters } from './concurrent-writers'
import { versionTimeline } from './version-timeline'
import { ebsSnapshot } from './ebs-snapshot'
import { sharedFiles } from './shared-files'
import { dataProtection } from './data-protection'

// Chapter scenes, one per section, in section order.
export const storageScenes: Scene[] = [
  storageKinds,
  presignedUpload,
  concurrentWriters,
  versionTimeline,
  ebsSnapshot,
  sharedFiles,
  dataProtection,
]
