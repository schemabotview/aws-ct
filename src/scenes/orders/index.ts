import type { Scene } from '@graphlearning/flow'
import { needs } from './needs'
import { database } from './database'
import { transaction } from './transaction'
import { connections } from './connections'
import { availability } from './availability'
import { keys } from './keys'
import { lastUnit } from './lastUnit'
import { cache } from './cache'
import { migration } from './migration'

export const ordersScenes: Scene[] = [needs, database, transaction, connections, availability, keys, lastUnit, cache, migration]
