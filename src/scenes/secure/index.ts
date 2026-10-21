import type { Scene } from '@graphlearning/flow'
import { principals } from './principals'
import { org } from './org'
import { roleTrust } from './role-trust'
import { assume } from './assume'
import { statements } from './statements'
import { denied } from './denied'
import { crossAccount } from './cross-account'
import { guardrails } from './guardrails'

export const secureScenes: Scene[] = [principals, org, roleTrust, assume, statements, denied, crossAccount, guardrails]
