import type { TreeEntry } from '@graphlearning/flow'
import { projectTree } from '../project'

// shop-on-aws through Course 6. Folders the section is not about are shown closed with a count, so
// the explorer fits its pane as the project grows.
const COURSE_5 = [
  'catalog/p-1001.json', 'env.sh', 'requirements.txt',
  'infra/01-bucket.sh', 'infra/04-guardrails.sh', 'infra/04-roles.sh', 'infra/05-dns.sh', 'infra/05-egress.sh', 'infra/05-filters.sh',
  'infra/05-lb.sh', 'infra/05-network.sh', 'infra/05-routes.sh', 'infra/dns/shop-alias.json', 'infra/teardown.sh',
  'policies/auditor-reads.json', 'policies/order-api-access.json', 'policies/order-api-trust.json', 'policies/reports-bucket.json',
  'policies/scp-regions.json',
  'tools/cidr_plan.py', 'tools/cost_ledger.py', 'tools/health_timeline.py', 'tools/probe.py', 'tools/route_pick.py',
]
const ADDS: [string, string[]][] = [
  ['01', ['app/server.py']],
  ['03', ['infra/06-template.sh']],
  ['04', ['tools/purchase_mix.py']],
  ['05', ['app/user-data.sh']],
  ['06', ['infra/06-scaling.sh', 'tools/surge.py']],
  ['07', ['app/Dockerfile', 'app/task-definition.json']],
  ['09', ['tools/carts.py']],
]

export function runTree(step: string, active: string, fresh: string[] = []): TreeEntry[] {
  const files = [...COURSE_5, ...ADDS.filter(([s]) => s <= step).flatMap(([, f]) => f)]
  return projectTree(files, active, fresh, ['app', 'catalog', 'infra', 'policies', 'tools'])
}
