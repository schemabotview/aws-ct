import type { Course } from '../types'
import { cloudOperatingModel } from './01-cloud-operating-model'
import { sharedResponsibility } from './02-shared-responsibility'
import { regionsAndAvailabilityZones } from './03-regions-and-availability-zones'
import { accountsAndFirstSession } from './04-accounts-and-first-session'
import { apiRequestWalkthrough } from './05-api-request-walkthrough'
import { billingAndCleanup } from './06-billing-and-cleanup'

// Chapter 1 of AWS-COURSE-PLAN.md — 6 of 6 sections, one scene each.
//
// Objective: Explain the cloud operating model and trace a small workload without losing sight of
// access, responsibility, and cost.
//
// Worked illustrations (from the plan): a product-page request diagram (§1, `product-page`); an
// annotated CLI/API call showing identity, Region, resource, and response (§5, `api-call-anatomy`);
// a responsibility matrix (§2); a resource-cost ledger with explicit assumptions (§6). §6 explains
// why a budget alert is not a universal spending cap and why stopping compute leaves other billable
// resources.
//
// Outcome: Explain where a workload runs, who is responsible for its components, and how an API
// request and resource lifecycle relate to access and charges.
//
// Bridge: A safe first session is only a starting point; next we make identities, permissions, and
// account boundaries explicit. (Spoken as the last line of §6's narration.)
export const foundations: Course = {
  id: 'foundations',
  title: 'Cloud Foundations and a Safe First Workload',
  sections: [
    cloudOperatingModel,
    sharedResponsibility,
    regionsAndAvailabilityZones,
    accountsAndFirstSession,
    apiRequestWalkthrough,
    billingAndCleanup,
  ],
}
