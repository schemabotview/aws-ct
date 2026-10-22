import type { TreeEntry } from '@graphlearning/flow'
import { projectTree } from '../project'

// shop-on-aws through Course 9: Course 8's project, then the SQL, the database tools and the DMS task.
const COURSE_8 = [
  'app/Dockerfile', 'app/server.py', 'app/task-definition.json', 'app/user-data.sh',
  'catalog/p-1001.json', 'env.sh', 'requirements.txt',
  'infra/01-bucket.sh', 'infra/04-guardrails.sh', 'infra/04-roles.sh', 'infra/05-dns.sh', 'infra/05-egress.sh', 'infra/05-filters.sh',
  'infra/05-lb.sh', 'infra/05-network.sh', 'infra/05-routes.sh', 'infra/06-scaling.sh', 'infra/06-template.sh', 'infra/dns/shop-alias.json',
  'infra/s3/catalog-lifecycle.json', 'infra/s3/reports-encryption.json', 'infra/teardown.sh',
  'policies/auditor-reads.json', 'policies/order-api-access.json', 'policies/order-api-trust.json', 'policies/reports-bucket.json',
  'policies/scp-regions.json', 'policies/shop-deploy-trust.json',
  'templates/filters.yaml', 'templates/network.yaml', 'templates/orders-db.yaml', 'templates/storage.yaml',
  'tools/carts.py', 'tools/cidr_plan.py', 'tools/cost_ledger.py', 'tools/health_timeline.py', 'tools/presign_upload.py', 'tools/probe.py',
  'tools/purchase_mix.py', 'tools/replacement_preview.py', 'tools/route_pick.py', 'tools/surge.py', 'tools/traffic_shift.py',
  'tools/two_writers.py', 'tools/versions.py',
]
const ADDS: [string, string[]][] = [
  ['03', ['sql/place_order.sql', 'sql/schema.sql']],
  ['04', ['tools/connections.py']],
  ['06', ['tools/orders_table.py']],
  ['07', ['tools/last_unit.py']],
  ['08', ['tools/cache_aside.py']],
  ['09', ['infra/09-migration.sh', 'infra/dms/table-mappings.json']],
]

export function ordersTree(step: string, active: string, fresh: string[] = []): TreeEntry[] {
  const files = [...COURSE_8, ...ADDS.filter(([s]) => s <= step).flatMap(([, f]) => f)]
  return projectTree(files, active, fresh, ['app', 'catalog', 'infra', 'policies', 'sql', 'templates', 'tools'])
}
