import type { TreeEntry } from '@graphlearning/flow'
import { projectTree } from '../project'

// shop-on-aws through Course 7: Course 6's project, then templates/ and the tools that read them.
const COURSE_6 = [
  'app/Dockerfile', 'app/server.py', 'app/task-definition.json', 'app/user-data.sh',
  'catalog/p-1001.json', 'env.sh', 'requirements.txt',
  'infra/01-bucket.sh', 'infra/04-guardrails.sh', 'infra/04-roles.sh', 'infra/05-dns.sh', 'infra/05-egress.sh', 'infra/05-filters.sh',
  'infra/05-lb.sh', 'infra/05-network.sh', 'infra/05-routes.sh', 'infra/06-scaling.sh', 'infra/06-template.sh', 'infra/dns/shop-alias.json',
  'infra/teardown.sh',
  'policies/auditor-reads.json', 'policies/order-api-access.json', 'policies/order-api-trust.json', 'policies/reports-bucket.json',
  'policies/scp-regions.json',
  'tools/carts.py', 'tools/cidr_plan.py', 'tools/cost_ledger.py', 'tools/health_timeline.py', 'tools/probe.py', 'tools/purchase_mix.py',
  'tools/route_pick.py', 'tools/surge.py',
]
const ADDS: [string, string[]][] = [
  ['03', ['templates/network.yaml']],
  ['04', ['templates/filters.yaml']],
  ['05', ['tools/replacement_preview.py']],
  ['06', ['templates/orders-db.yaml']],
  ['07', ['tools/traffic_shift.py']],
  ['08', ['policies/shop-deploy-trust.json']],
]

export function automateTree(step: string, active: string, fresh: string[] = []): TreeEntry[] {
  const files = [...COURSE_6, ...ADDS.filter(([s]) => s <= step).flatMap(([, f]) => f)]
  return projectTree(files, active, fresh, ['app', 'catalog', 'infra', 'policies', 'templates', 'tools'])
}
