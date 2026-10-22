import type { Scene } from '@graphlearning/flow'
import { kinds } from './kinds'
import { catalog } from './catalog'
import { presign } from './presign'
import { writers } from './writers'
import { versions } from './versions'
import { volumes } from './volumes'
import { protection } from './protection'

export const filesScenes: Scene[] = [kinds, catalog, presign, writers, versions, volumes, protection]
