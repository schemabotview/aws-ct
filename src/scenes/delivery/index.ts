import type { Scene } from '@graphlearning/flow'
import { declarativeVsImperative } from './declarative-vs-imperative'
import { stackTemplate } from './stack-template'
import { paramsAndSecrets } from './params-and-secrets'
import { changeSets } from './change-sets'
import { rollbackAndProtection } from './rollback-and-protection'
import { deploymentStrategies } from './deployment-strategies'
import { promotionAndTools } from './promotion-and-tools'

// Chapter scenes, one per section, in section order.
export const deliveryScenes: Scene[] = [
  declarativeVsImperative,
  stackTemplate,
  paramsAndSecrets,
  changeSets,
  rollbackAndProtection,
  deploymentStrategies,
  promotionAndTools,
]
