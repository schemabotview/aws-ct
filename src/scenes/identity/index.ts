import type { Scene } from '@graphlearning/flow'
import { identityCenterMap } from './identity-center-map'
import { orderApiRole } from './order-api-role'
import { policyAnatomy } from './policy-anatomy'
import { evaluationFlow } from './evaluation-flow'
import { crossAccountRead } from './cross-account-read'
import { orgStructure } from './org-structure'
import { guardrails } from './guardrails'

// Chapter 2's scenes, one per section, in section order.
export const identityScenes: Scene[] = [
  identityCenterMap,
  orderApiRole,
  policyAnatomy,
  evaluationFlow,
  crossAccountRead,
  orgStructure,
  guardrails,
]
