import type { Scene } from '@graphlearning/flow'
import { telemetryCorrelation } from './telemetry-correlation'
import { slosAndAlarms } from './slos-and-alarms'
import { cloudtrailEvidence } from './cloudtrail-evidence'
import { opsAccess } from './ops-access'
import { keysAndRotation } from './keys-and-rotation'
import { edgeAndDetection } from './edge-and-detection'
import { incidentContainment } from './incident-containment'
import { backupAndRestore } from './backup-and-restore'
import { disasterRecovery } from './disaster-recovery'
import { quotasAndResilience } from './quotas-and-resilience'

// Chapter scenes, one per section, in section order.
export const operationsScenes: Scene[] = [
  telemetryCorrelation,
  slosAndAlarms,
  cloudtrailEvidence,
  opsAccess,
  keysAndRotation,
  edgeAndDetection,
  incidentContainment,
  backupAndRestore,
  disasterRecovery,
  quotasAndResilience,
]
