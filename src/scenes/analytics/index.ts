import type { Scene } from '@graphlearning/flow'
import { stateVsHistory } from './state-vs-history'
import { cdcReconcile } from './cdc-reconcile'
import { lakeLayout } from './lake-layout'
import { glueCatalog } from './glue-catalog'
import { athenaQuery } from './athena-query'
import { streamLag } from './stream-lag'
import { warehouseOrCluster } from './warehouse-or-cluster'

// Chapter scenes, one per section, in section order.
export const analyticsScenes: Scene[] = [
  stateVsHistory,
  cdcReconcile,
  lakeLayout,
  glueCatalog,
  athenaQuery,
  streamLag,
  warehouseOrCluster,
]
