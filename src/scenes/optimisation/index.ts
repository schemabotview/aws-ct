import type { Scene } from '@graphlearning/flow'
import { saturationCurve } from './saturation-curve'
import { edgeCaching } from './edge-caching'
import { capacityPlans } from './capacity-plans'
import { costAllocation } from './cost-allocation'
import { monthlyCost } from './monthly-cost'
import { sustainabilityLevers } from './sustainability-levers'

// Chapter scenes, one per section, in section order.
export const optimisationScenes: Scene[] = [
  saturationCurve,
  edgeCaching,
  capacityPlans,
  costAllocation,
  monthlyCost,
  sustainabilityLevers,
]
