import type { Scene } from '@graphlearning/flow'
import { cidr } from './cidr'
import { vpc } from './vpc'
import { routes } from './routes'
import { egress } from './egress'
import { filters } from './filters'
import { dns } from './dns'
import { tls } from './tls'
import { lb } from './lb'
import { privatePaths } from './private'

export const networkScenes: Scene[] = [cidr, vpc, routes, egress, filters, dns, tls, lb, privatePaths]
