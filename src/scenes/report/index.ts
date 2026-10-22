import type { Scene } from '@graphlearning/flow'
import { history } from './history'
import { reconcile } from './reconcile'
import { layout } from './layout'
import { catalog } from './catalog'
import { athena } from './athena'
import { stream } from './stream'
import { warehouse } from './warehouse'

export const reportScenes: Scene[] = [history, reconcile, layout, catalog, athena, stream, warehouse]
