import type { Course } from '../types'
import { dataRequirements } from './01-data-requirements'
import { rdsAndAurora } from './02-rds-and-aurora'
import { transactionsAndConnections } from './03-transactions-and-connections'
import { availabilityReadScalingRestore } from './04-availability-read-scaling-restore'
import { dynamodbKeysAndIndexes } from './05-dynamodb-keys-and-indexes'
import { dynamodbConditionsAndConsistency } from './06-dynamodb-conditions-and-consistency'
import { cachingAndStaleReads } from './07-caching-and-stale-reads'
import { migrationAndSpecialistDatabases } from './08-migration-and-specialist-databases'

// Chapter 6 of AWS-COURSE-PLAN.md — 8 of 8 sections, one scene each.
//
// Objective: Match application requirements to database choices and explain their correctness and
// availability boundaries.
//
// Worked illustrations (from the plan): SQL for placing an order (§3, run in real PostgreSQL 16); a
// connection-exhaustion trace (§3, run); an RDS failover vs read-replica comparison (§4); DynamoDB
// item/key sketches and a conditional update (§5, §6, moto); a stale-cache timeline (§7, run). RDS
// Multi-AZ instance, Multi-AZ cluster, Aurora and read replicas are kept separate (§4); DynamoDB
// table/index and regional/global variants are named before consistency claims (§6).
//
// Outcome: Compare relational, key-value, and cached designs, explain a data-access sequence, and
// identify the difference between transaction correctness, availability, read scaling, and recovery.
//
// Bridge: Durable application state now supports workflows that cross service boundaries; next we
// connect requests, events, and background work. (Spoken as the last line of §8's narration.)
export const databases: Course = {
  id: 'databases',
  title: 'Databases and Application Access Patterns',
  sections: [
    dataRequirements,
    rdsAndAurora,
    transactionsAndConnections,
    availabilityReadScalingRestore,
    dynamodbKeysAndIndexes,
    dynamodbConditionsAndConsistency,
    cachingAndStaleReads,
    migrationAndSpecialistDatabases,
  ],
}
