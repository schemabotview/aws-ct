import type { TreeEntry } from '@graphlearning/flow'
import { projectTree } from '../project'

// shop-on-aws through Course 5: everything Course 4 left, then the network scripts and tools.
const COURSE_4 = [
  'catalog/p-1001.json', 'env.sh', 'infra/01-bucket.sh', 'infra/04-guardrails.sh', 'infra/04-roles.sh', 'infra/teardown.sh',
  'policies/auditor-reads.json', 'policies/order-api-access.json', 'policies/order-api-trust.json', 'policies/reports-bucket.json',
  'policies/scp-regions.json', 'requirements.txt', 'tools/cost_ledger.py', 'tools/probe.py',
]
const ADDS: [string, string[]][] = [
  ['01', ['tools/cidr_plan.py']],
  ['02', ['infra/05-network.sh']],
  ['03', ['infra/05-routes.sh', 'tools/route_pick.py']],
  ['04', ['infra/05-egress.sh']],
  ['05', ['infra/05-filters.sh']],
  ['06', ['infra/05-dns.sh', 'infra/dns/shop-alias.json']],
  ['08', ['infra/05-lb.sh', 'tools/health_timeline.py']],
]

export function networkTree(step: string, active: string, fresh: string[] = []): TreeEntry[] {
  const files = [...COURSE_4, ...ADDS.filter(([s]) => s <= step).flatMap(([, f]) => f)]
  return projectTree(files, active, fresh, ['policies'])
}
