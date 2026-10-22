import type { Course } from '../types'
import { stateAgainstHistory } from './01-state-against-history'
import { gettingTheDataOut } from './02-getting-the-data-out'
import { theLakesLayout } from './03-the-lakes-layout'
import { theCatalogAndItsGovernance } from './04-the-catalog-and-its-governance'
import { queryingWithAthena } from './05-querying-with-athena'
import { aStreamOfClicks } from './06-a-stream-of-clicks'
import { warehouseOrCluster } from './07-warehouse-or-cluster'

// Course 11 — Report on sales. State against history; CDC files reconciled to the source; the lake
// laid out as Parquet by day; the Glue catalog, a schema change and Lake Formation columns; the
// daily sales SQL (DuckDB locally, Athena submitted); Kinesis shards and consumer lag; Redshift / EMR.
export const report: Course = {
  id: 'report',
  title: 'Report on sales',
  sections: [stateAgainstHistory, gettingTheDataOut, theLakesLayout, theCatalogAndItsGovernance, queryingWithAthena, aStreamOfClicks, warehouseOrCluster],
}
