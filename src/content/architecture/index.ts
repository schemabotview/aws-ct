import type { Course } from '../types'
import { requirementsAndDecisions } from './01-requirements-and-decisions'
import { platformComparison } from './02-platform-comparison'
import { regionalChoices } from './03-regional-choices'
import { migrationAndCutover } from './04-migration-and-cutover'
import { wellArchitectedReview } from './05-well-architected-review'

// Chapter 12 — Architecture Evolution and Justified Decisions
//
// Objective: Explain a complete AWS architecture and its evolution under changing requirements.
//
// Worked illustrations: three alternative order-platform diagrams (§2); a decision record connecting
// requirements to rejected/selected options (§1); a regional-failure case (§3, runs locally, assumed
// lag); a staged migration with reconciliation and rollback limits (§4). Six pillars reviewed together
// (§5). Why extra services or Regions add failure modes (§2, §3, §5); prioritising by evidence rather
// than a universal reference architecture (§5).
//
// Outcome: Present and critique a coherent AWS design, trace its requests and data, and justify
// trade-offs and evolution steps under stated requirements.
//
// Bridge: Continue through optional implementation and operational practice, current service
// documentation, architecture reviews, and specialist study. Real production responsibility requires
// demonstrated deployment, security, incident, and recovery competence beyond following the course's
// worked explanations. (Spoken as the last lines of §5's narration.)
export const architecture: Course = {
  id: 'architecture',
  title: 'Architecture Evolution and Justified Decisions',
  sections: [
    requirementsAndDecisions,
    platformComparison,
    regionalChoices,
    migrationAndCutover,
    wellArchitectedReview,
  ],
}
