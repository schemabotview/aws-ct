import type { Scene } from '@graphlearning/flow'
import { accessPatterns } from './access-patterns'
import { rdsInstance } from './rds-instance'
import { orderTransaction } from './order-transaction'
import { rdsAvailability } from './rds-availability'
import { dynamodbKeys } from './dynamodb-keys'
import { dynamodbConditions } from './dynamodb-conditions'
import { cacheAside } from './cache-aside'
import { migrationAndSpecialists } from './migration-and-specialists'

// Chapter scenes, one per section, in section order.
export const databasesScenes: Scene[] = [
  accessPatterns,
  rdsInstance,
  orderTransaction,
  rdsAvailability,
  dynamodbKeys,
  dynamodbConditions,
  cacheAside,
  migrationAndSpecialists,
]
