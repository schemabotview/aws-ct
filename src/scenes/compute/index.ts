import type { Scene } from '@graphlearning/flow'
import { computeChoice } from './compute-choice'
import { launchTemplate } from './launch-template'
import { purchaseOptions } from './purchase-options'
import { bootstrapAndSsm } from './bootstrap-and-ssm'
import { scalingTimeline } from './scaling-timeline'
import { ecsTask } from './ecs-task'
import { eksChoice } from './eks-choice'
import { statelessDesign } from './stateless-design'

// Chapter scenes, one per section, in section order.
export const computeScenes: Scene[] = [
  computeChoice,
  launchTemplate,
  purchaseOptions,
  bootstrapAndSsm,
  scalingTimeline,
  ecsTask,
  eksChoice,
  statelessDesign,
]
