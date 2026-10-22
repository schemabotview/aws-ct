import type { Course } from '../types'
import { whatTheOrdersNeed } from './01-what-the-orders-need'
import { theOrdersDatabase } from './02-the-orders-database'
import { placingAnOrder } from './03-placing-an-order'
import { connectionsAndCredentials } from './04-connections-and-credentials'
import { availabilityReadScalingAndRestore } from './05-availability-read-scaling-and-restore'
import { aKeyValueTable } from './06-a-key-value-table'
import { theLastUnitInStock } from './07-the-last-unit-in-stock'
import { cachingTheProductPage } from './08-caching-the-product-page'
import { migrationAndSpecialistDatabases } from './09-migration-and-specialist-databases'

// Course 9 — Keep its orders. Access patterns first; the RDS instance; a transaction in real
// PostgreSQL 16; credentials and the connection budget; Multi-AZ, replicas and restore; DynamoDB
// keys, a hot key, conditional transactions; cache-aside; DMS and the specialist engines.
export const orders: Course = {
  id: 'orders',
  title: 'Keep its orders',
  sections: [whatTheOrdersNeed, theOrdersDatabase, placingAnOrder, connectionsAndCredentials, availabilityReadScalingAndRestore, aKeyValueTable, theLastUnitInStock, cachingTheProductPage, migrationAndSpecialistDatabases],
}
