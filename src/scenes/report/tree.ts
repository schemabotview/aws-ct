import type { TreeEntry } from '@graphlearning/flow'
import { projectTree } from '../project'

// shop-on-aws through Course 11: Course 10's project, then the lake, its catalog, the analytics
// code and the clickstream.
const COURSE_10 = [
  'app/Dockerfile', 'app/server.py', 'app/task-definition.json', 'app/user-data.sh', 'catalog/p-1001.json', 'env.sh',
  'functions/place_order/handler.py', 'infra/01-bucket.sh', 'infra/04-guardrails.sh', 'infra/04-roles.sh', 'infra/05-dns.sh',
  'infra/05-egress.sh', 'infra/05-filters.sh', 'infra/05-lb.sh', 'infra/05-network.sh', 'infra/05-routes.sh',
  'infra/06-scaling.sh', 'infra/06-template.sh', 'infra/09-migration.sh', 'infra/10-api.sh', 'infra/10-events.sh',
  'infra/10-fanout.sh', 'infra/10-function.sh', 'infra/10-workflow.sh', 'infra/api/order-model.json',
  'infra/dms/table-mappings.json', 'infra/dns/shop-alias.json', 'infra/events/refunds.json', 'infra/events/sample.json',
  'infra/events/uk-vat.json', 'infra/s3/catalog-lifecycle.json', 'infra/s3/reports-encryption.json',
  'infra/sns/fraud-filter.json', 'infra/teardown.sh', 'policies/auditor-reads.json', 'policies/order-api-access.json',
  'policies/order-api-trust.json', 'policies/order-workflow-trust.json', 'policies/place-order-fn.json',
  'policies/place-order-trust.json', 'policies/reports-bucket.json', 'policies/scp-regions.json',
  'policies/shop-deploy-trust.json', 'requirements.txt', 'sql/place_order.sql', 'sql/schema.sql', 'templates/filters.yaml',
  'templates/network.yaml', 'templates/orders-db.yaml', 'templates/storage.yaml', 'tools/allow_send.py', 'tools/cache_aside.py',
  'tools/carts.py', 'tools/cidr_plan.py', 'tools/concurrency.py', 'tools/connections.py', 'tools/consumer.py',
  'tools/cost_ledger.py', 'tools/drain.py', 'tools/health_timeline.py', 'tools/invoke_local.py', 'tools/last_unit.py',
  'tools/orders_table.py', 'tools/presign_upload.py', 'tools/probe.py', 'tools/purchase_mix.py', 'tools/replacement_preview.py',
  'tools/route_pick.py', 'tools/run_workflow.py', 'tools/surge.py', 'tools/traffic_shift.py', 'tools/two_writers.py',
  'tools/versions.py', 'workers/ship_once.py', 'workflows/place-order.asl.json',
]
const ADDS: [string, string[]][] = [
  ['02', ['analytics/reconcile.py', 'lake/cdc/2026-10-12.jsonl', 'lake/cdc/2026-10-13.jsonl']],
  ['03', ['analytics/history.py', 'analytics/layout.py']],
  ['04', ['analytics/add_column.py', 'infra/11-catalog.sh', 'infra/glue/order-history.json']],
  ['05', ['analytics/daily_sales_duckdb.py', 'sql/daily_sales.sql']],
  ['06', ['analytics/consumer_lag.py', 'infra/11-stream.sh']],
]

export function reportTree(step: string, active: string, fresh: string[] = []): TreeEntry[] {
  const files = [...COURSE_10, ...ADDS.filter(([s]) => s <= step).flatMap(([, f]) => f)]
  return projectTree(files, active, fresh, ['app', 'catalog', 'functions', 'infra', 'lake', 'policies', 'sql', 'templates', 'tools', 'workers', 'workflows',
    'infra/api', 'infra/dms', 'infra/dns', 'infra/events', 'infra/glue', 'infra/s3', 'infra/sns'],
    ['infra'])
}
