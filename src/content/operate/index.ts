import type { Course } from '../types'
import { metricsLogsAndTraces } from './01-metrics-logs-and-traces'
import { objectivesAndAlarms } from './02-objectives-and-alarms'
import { cloudwatchAgainstCloudtrail } from './03-cloudwatch-against-cloudtrail'
import { operationalAccessAndInventory } from './04-operational-access-and-inventory'
import { keysSecretsAndRotation } from './05-keys-secrets-and-rotation'
import { layeredExposureAndDetection } from './06-layered-exposure-and-detection'
import { anIncident } from './07-an-incident'
import { backupsThatRestore } from './08-backups-that-restore'
import { rtoRpoAndDisasterRecovery } from './09-rto-rpo-and-disaster-recovery'
import { quotasThrottlingAndResilience } from './10-quotas-throttling-and-resilience'

// Course 12 — Operate it. Metrics, logs and traces on one slow evening; an SLO, its error budget and
// a fast-burn alarm; CloudTrail evidence; Systems Manager and Config; a key policy, encryption
// context and a rotation; prevention against detection; an incident; a timed restore drill; DR
// strategies; quotas and jittered retries.
export const operate: Course = {
  id: 'operate',
  title: 'Operate it',
  sections: [metricsLogsAndTraces, objectivesAndAlarms, cloudwatchAgainstCloudtrail, operationalAccessAndInventory, keysSecretsAndRotation, layeredExposureAndDetection, anIncident, backupsThatRestore, rtoRpoAndDisasterRecovery, quotasThrottlingAndResilience],
}
