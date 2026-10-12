import type { Scene } from '@graphlearning/flow'
import { decisionRecord } from './decision-record'
import { platformAlternatives } from './platform-alternatives'
import { regionChoices } from './region-choices'
import { stagedCutover } from './staged-cutover'
import { wellArchitectedReview } from './well-architected-review'

// Chapter scenes, one per section, in section order.
export const architectureScenes: Scene[] = [
  decisionRecord,
  platformAlternatives,
  regionChoices,
  stagedCutover,
  wellArchitectedReview,
]
