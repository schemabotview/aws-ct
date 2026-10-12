import type { Scene } from '@graphlearning/flow'
import { cidrPlan } from './cidr-plan'
import { vpcLayout } from './vpc-layout'
import { routeSelection } from './route-selection'
import { privateEgress } from './private-egress'
import { trafficFilters } from './traffic-filters'
import { dnsResolution } from './dns-resolution'
import { tlsPath } from './tls-path'
import { lbHealth } from './lb-health'
import { privateConnectivity } from './private-connectivity'

// Chapter scenes, one per section, in section order.
export const networkingScenes: Scene[] = [
  cidrPlan,
  vpcLayout,
  routeSelection,
  privateEgress,
  trafficFilters,
  dnsResolution,
  tlsPath,
  lbHealth,
  privateConnectivity,
]
