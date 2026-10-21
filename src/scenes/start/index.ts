import type { Scene } from '@graphlearning/flow'
import { tour } from './tour'
import { root } from './root'
import { firstSession } from './first-session'
import { emulator } from './emulator'
import { firstBucket } from './first-bucket'
import { cleanup } from './cleanup'

export const startScenes: Scene[] = [tour, root, firstSession, emulator, firstBucket, cleanup]
