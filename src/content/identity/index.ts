import type { Course } from '../types'
import { principalsAndFederation } from './01-principals-and-federation'
import { rolesAndTrust } from './02-roles-and-trust'
import { policyStatements } from './03-policy-statements'
import { policyEvaluation } from './04-policy-evaluation'
import { resourcePoliciesCrossAccount } from './05-resource-policies-cross-account'
import { organizationsAndIsolation } from './06-organizations-and-isolation'
import { guardrailsAndAudit } from './07-guardrails-and-audit'

// Chapter 2 of AWS-COURSE-PLAN.md — 7 of 7 sections, one scene each.
//
// Objective: Explain how AWS authorises requests and how account boundaries support delegated
// ownership.
//
// Worked illustrations (from the plan): annotated IAM JSON and a permission matrix (§3 `policy-anatomy`,
// §4 `evaluation-flow`); an application assuming a role (§2 `order-api-role`); a denied S3 request
// with the relevant policy context (§4); a development/production account diagram (§6 `org-structure`).
// The trust policy is kept apart from the permissions policy (§2), permission-granting policies from
// guardrails (§4, §7), and same-account from cross-account evaluation (§5) — no single intersection
// formula is taught.
//
// Outcome: Interpret a scoped policy, explain a role-assumption path, and reason about why a request
// is permitted or denied under stated account and policy assumptions.
//
// Bridge: Authorisation does not establish network reachability; next we trace the paths requests
// must travel. (Spoken as the last line of §7's narration.)
//
// Evidence: every policy card is parliament-checked (real actions, ARNs, condition keys); §4's matrix
// is asserted in moto by verify/identity/permission_matrix.py; evaluation rules are doc-cited in the
// scene files.
export const identity: Course = {
  id: 'identity',
  title: 'Identity, Permissions, and Account Governance',
  sections: [principalsAndFederation, rolesAndTrust, policyStatements, policyEvaluation, resourcePoliciesCrossAccount, organizationsAndIsolation, guardrailsAndAudit],
}
