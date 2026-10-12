import type { Scene } from '@graphlearning/flow'
import { productPage } from './product-page'
import { responsibilityMatrix } from './responsibility-matrix'
import { regionBoundaries } from './region-boundaries'
import { firstSession } from './first-session'
import { apiCallAnatomy } from './api-call-anatomy'
import { costLedger } from './cost-ledger'

// Chapter 1's scenes, one per section, in section order.
export const foundationsScenes: Scene[] = [
  productPage,
  responsibilityMatrix,
  regionBoundaries,
  firstSession,
  apiCallAnatomy,
  costLedger,
]
