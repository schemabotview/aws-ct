import type { Course } from '../types'
import { principalsAuthenticationAndFederation } from './01-principals-authentication-and-federation'
import { accountsAndEnvironments } from './02-accounts-and-environments'
import { aRoleForTheApp } from './03-a-role-for-the-app'
import { assumingTheRole } from './04-assuming-the-role'
import { policyStatements } from './05-policy-statements'
import { whyARequestIsDenied } from './06-why-a-request-is-denied'
import { resourcePoliciesAndCrossAccountAccess } from './07-resource-policies-and-cross-account-access'
import { guardrailsAndAuditOwnership } from './08-guardrails-and-audit-ownership'

// Course 4 — Lock it down. Principals and federation, accounts in an organization, the OrderApi
// role (trust, credentials, permissions), evaluation under enforcement, cross-account access, SCPs.
export const secure: Course = {
  id: 'secure',
  title: 'Lock it down',
  sections: [principalsAuthenticationAndFederation, accountsAndEnvironments, aRoleForTheApp, assumingTheRole, policyStatements, whyARequestIsDenied, resourcePoliciesAndCrossAccountAccess, guardrailsAndAuditOwnership],
}
