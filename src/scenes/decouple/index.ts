import type { Scene } from '@graphlearning/flow'
import { api } from './api'
import { fn } from './fn'
import { concurrency } from './concurrency'
import { queue } from './queue'
import { fanout } from './fanout'
import { events } from './events'
import { workflow } from './workflow'
import { once } from './once'
import { choices } from './choices'

export const decoupleScenes: Scene[] = [api, fn, concurrency, queue, fanout, events, workflow, once, choices]
