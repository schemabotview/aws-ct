import type { TreeEntry } from '@graphlearning/flow'
import { projectTree } from '../project'

// shop-on-aws through Course 10: Course 9's project, then the API, the function, the messaging
// scripts, the workflow and their tools.
const COURSE_9 = [
  'app/Dockerfile', 'app/server.py', 'app/task-definition.json', 'app/user-data.sh',
  'catalog/p-1001.json', 'env.sh', 'requirements.txt',
  'infra/01-bucket.sh', 'infra/04-guardrails.sh', 'infra/04-roles.sh', 'infra/05-dns.sh', 'infra/05-egress.sh', 'infra/05-filters.sh',
  'infra/05-lb.sh', 'infra/05-network.sh', 'infra/05-routes.sh', 'infra/06-scaling.sh', 'infra/06-template.sh', 'infra/09-migration.sh',
  'infra/dms/table-mappings.json', 'infra/dns/shop-alias.json',
  'infra/s3/catalog-lifecycle.json', 'infra/s3/reports-encryption.json', 'infra/teardown.sh',
  'policies/auditor-reads.json', 'policies/order-api-access.json', 'policies/order-api-trust.json', 'policies/reports-bucket.json',
  'policies/scp-regions.json', 'policies/shop-deploy-trust.json',
  'sql/place_order.sql', 'sql/schema.sql',
  'templates/filters.yaml', 'templates/network.yaml', 'templates/orders-db.yaml', 'templates/storage.yaml',
  'tools/cache_aside.py', 'tools/carts.py', 'tools/cidr_plan.py', 'tools/connections.py', 'tools/cost_ledger.py', 'tools/health_timeline.py',
  'tools/last_unit.py', 'tools/orders_table.py', 'tools/presign_upload.py', 'tools/probe.py', 'tools/purchase_mix.py',
  'tools/replacement_preview.py', 'tools/route_pick.py', 'tools/surge.py', 'tools/traffic_shift.py', 'tools/two_writers.py', 'tools/versions.py',
]
const ADDS: [string, string[]][] = [
  ['01', ['infra/10-api.sh', 'infra/api/order-model.json']],
  ['02', ['functions/place_order/handler.py', 'infra/10-function.sh', 'policies/place-order-trust.json', 'tools/invoke_local.py']],
  ['03', ['policies/place-order-fn.json', 'tools/concurrency.py']],
  ['04', ['tools/consumer.py']],
  ['05', ['infra/10-fanout.sh', 'infra/sns/fraud-filter.json', 'tools/allow_send.py', 'tools/drain.py']],
  ['06', ['infra/10-events.sh', 'infra/events/refunds.json', 'infra/events/sample.json', 'infra/events/uk-vat.json']],
  ['07', ['infra/10-workflow.sh', 'policies/order-workflow-trust.json', 'tools/run_workflow.py', 'workflows/place-order.asl.json']],
  ['08', ['workers/ship_once.py']],
]

export function decoupleTree(step: string, active: string, fresh: string[] = []): TreeEntry[] {
  const files = [...COURSE_9, ...ADDS.filter(([s]) => s <= step).flatMap(([, f]) => f)]
  return projectTree(files, active, fresh, ['app', 'catalog', 'functions', 'infra', 'policies', 'sql', 'templates', 'tools', 'workflows'])
}
