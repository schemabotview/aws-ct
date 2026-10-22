import type { Scene } from '@graphlearning/flow'
import { telemetry } from './telemetry'
import { slo } from './slo'
import { trail } from './trail'
import { access } from './access'
import { keys } from './keys'
import { exposure } from './exposure'
import { incident } from './incident'
import { backup } from './backup'
import { dr } from './dr'
import { quotas } from './quotas'

export const operateScenes: Scene[] = [telemetry, slo, trail, access, keys, exposure, incident, backup, dr, quotas]
