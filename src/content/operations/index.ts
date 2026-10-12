import type { Course } from '../types'
import { telemetryAndCorrelation } from './01-telemetry-and-correlation'
import { objectivesAndAlarms } from './02-objectives-and-alarms'
import { cloudwatchVersusCloudtrail } from './03-cloudwatch-versus-cloudtrail'
import { operationalAccessAndInventory } from './04-operational-access-and-inventory'
import { keysSecretsAndRotation } from './05-keys-secrets-and-rotation'
import { layeredExposureAndDetection } from './06-layered-exposure-and-detection'
import { incidentTriageAndContainment } from './07-incident-triage-and-containment'
import { backupAndRestoreValidation } from './08-backup-and-restore-validation'
import { disasterRecoveryAndFailover } from './09-disaster-recovery-and-failover'
import { quotasThrottlingAndResilience } from './10-quotas-throttling-and-resilience'

// Chapter 10 — Production Visibility, Security, and Recovery
//
// Objective: Explain how to detect, investigate, contain, and recover from operational failures.
//
// Worked illustrations: a latency incident correlated across metrics/logs/traces (§1, runs locally); an
// API audit event with its collection assumptions (§3); a secret rotation that breaks a connection (§5,
// runs locally); a compromised-role containment sequence (§7, revoke-sessions policy parliament-checked);
// a restore timeline with measured recovery checkpoints (§8). Detection vs prevention (§6), an alarm vs
// an automatic remedy (§2, §4). Why HA and replication do not prove recovery from deletion, corruption
// or a regional incident (§8, §9); adjustable vs fixed quotas (§10).
//
// Outcome: Interpret operational evidence, explain a plausible incident/recovery sequence, and assess
// whether a design's observability, security, and recovery claims are supported by its configured
// controls and validation evidence.
//
// Bridge: Once behaviour can be observed and recovered, next we use measurements to improve latency,
// resource use, and cost. (Spoken as the last line of §10's narration.)
export const operations: Course = {
  id: 'operations',
  title: 'Production Visibility, Security, and Recovery',
  sections: [
    telemetryAndCorrelation,
    objectivesAndAlarms,
    cloudwatchVersusCloudtrail,
    operationalAccessAndInventory,
    keysSecretsAndRotation,
    layeredExposureAndDetection,
    incidentTriageAndContainment,
    backupAndRestoreValidation,
    disasterRecoveryAndFailover,
    quotasThrottlingAndResilience,
  ],
}
