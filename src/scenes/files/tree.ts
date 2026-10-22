import type { TreeEntry } from '@graphlearning/flow'
import { projectTree } from '../project'

// shop-on-aws through Course 8: Course 7's project, then the storage template and the S3 tools.
const COURSE_7 = [
  'app/Dockerfile', 'app/server.py', 'app/task-definition.json', 'app/user-data.sh',
  'catalog/p-1001.json', 'env.sh', 'requirements.txt',
  'infra/01-bucket.sh', 'infra/04-guardrails.sh', 'infra/04-roles.sh', 'infra/05-dns.sh', 'infra/05-egress.sh', 'infra/05-filters.sh',
  'infra/05-lb.sh', 'infra/05-network.sh', 'infra/05-routes.sh', 'infra/06-scaling.sh', 'infra/06-template.sh', 'infra/dns/shop-alias.json',
  'infra/teardown.sh',
  'policies/auditor-reads.json', 'policies/order-api-access.json', 'policies/order-api-trust.json', 'policies/reports-bucket.json',
  'policies/scp-regions.json', 'policies/shop-deploy-trust.json',
  'templates/filters.yaml', 'templates/network.yaml', 'templates/orders-db.yaml',
  'tools/carts.py', 'tools/cidr_plan.py', 'tools/cost_ledger.py', 'tools/health_timeline.py', 'tools/probe.py', 'tools/purchase_mix.py',
  'tools/replacement_preview.py', 'tools/route_pick.py', 'tools/surge.py', 'tools/traffic_shift.py',
]
const ADDS: [string, string[]][] = [
  ['02', ['templates/storage.yaml']],
  ['03', ['tools/presign_upload.py']],
  ['04', ['tools/two_writers.py']],
  ['05', ['infra/s3/catalog-lifecycle.json', 'tools/versions.py']],
  ['07', ['infra/s3/reports-encryption.json']],
]

export function filesTree(step: string, active: string, fresh: string[] = []): TreeEntry[] {
  const files = [...COURSE_7, ...ADDS.filter(([s]) => s <= step).flatMap(([, f]) => f)]
  return projectTree(files, active, fresh, ['app', 'catalog', 'infra', 'policies', 'templates', 'tools'])
}
