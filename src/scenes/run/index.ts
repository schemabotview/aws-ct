import type { Scene } from '@graphlearning/flow'
import { orderApi } from './order-api'
import { computeChoice } from './compute-choice'
import { launchTemplate } from './launch-template'
import { purchase } from './purchase'
import { bootstrap } from './bootstrap'
import { scaling } from './scaling'
import { ecs } from './ecs'
import { eks } from './eks'
import { stateless } from './stateless'

export const runScenes: Scene[] = [orderApi, computeChoice, launchTemplate, purchase, bootstrap, scaling, ecs, eks, stateless]
