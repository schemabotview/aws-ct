import type { TreeEntry } from '@graphlearning/flow'
import { projectTree } from '../project'

// shop-on-aws through Course 12: Course 11's project, then the operations code (ops/), the
// runbook, and the alarm, trail, patching, key and backup scripts.
const COURSE_11 = [
  'analytics/add_column.py', 'analytics/consumer_lag.py', 'analytics/daily_sales_duckdb.py', 'analytics/history.py',
  'analytics/layout.py', 'analytics/reconcile.py', 'app/Dockerfile', 'app/server.py', 'app/task-definition.json',
  'app/user-data.sh', 'catalog/p-1001.json', 'env.sh', 'functions/place_order/handler.py', 'infra/01-bucket.sh',
  'infra/04-guardrails.sh', 'infra/04-roles.sh', 'infra/05-dns.sh', 'infra/05-egress.sh', 'infra/05-filters.sh',
  'infra/05-lb.sh', 'infra/05-network.sh', 'infra/05-routes.sh', 'infra/06-scaling.sh', 'infra/06-template.sh',
  'infra/09-migration.sh', 'infra/10-api.sh', 'infra/10-events.sh', 'infra/10-fanout.sh', 'infra/10-function.sh',
  'infra/10-workflow.sh', 'infra/11-catalog.sh', 'infra/11-stream.sh', 'infra/api/order-model.json',
  'infra/dms/table-mappings.json', 'infra/dns/shop-alias.json', 'infra/events/refunds.json', 'infra/events/sample.json',
  'infra/events/uk-vat.json', 'infra/glue/order-history.json', 'infra/s3/catalog-lifecycle.json',
  'infra/s3/reports-encryption.json', 'infra/sns/fraud-filter.json', 'infra/teardown.sh', 'lake/cdc/2026-10-12.jsonl',
  'lake/cdc/2026-10-13.jsonl', 'policies/auditor-reads.json', 'policies/order-api-access.json', 'policies/order-api-trust.json',
  'policies/order-workflow-trust.json', 'policies/place-order-fn.json', 'policies/place-order-trust.json',
  'policies/reports-bucket.json', 'policies/scp-regions.json', 'policies/shop-deploy-trust.json', 'requirements.txt',
  'sql/daily_sales.sql', 'sql/place_order.sql', 'sql/schema.sql', 'templates/filters.yaml', 'templates/network.yaml',
  'templates/orders-db.yaml', 'templates/storage.yaml', 'tools/allow_send.py', 'tools/cache_aside.py', 'tools/carts.py',
  'tools/cidr_plan.py', 'tools/concurrency.py', 'tools/connections.py', 'tools/consumer.py', 'tools/cost_ledger.py',
  'tools/drain.py', 'tools/health_timeline.py', 'tools/invoke_local.py', 'tools/last_unit.py', 'tools/orders_table.py',
  'tools/presign_upload.py', 'tools/probe.py', 'tools/purchase_mix.py', 'tools/replacement_preview.py', 'tools/route_pick.py',
  'tools/run_workflow.py', 'tools/surge.py', 'tools/traffic_shift.py', 'tools/two_writers.py', 'tools/versions.py',
  'workers/ship_once.py', 'workflows/place-order.asl.json',
]
const ADDS: [string, string[]][] = [
  ['02', ['infra/12-alarm.sh', 'ops/error_budget.py']],
  ['03', ['infra/12-trail.sh', 'infra/trail/event-selectors.json', 'ops/evidence/2026-10-12-trail.json', 'ops/who_changed.py']],
  ['04', ['infra/12-ops.sh', 'infra/config/s3-no-public-read.json']],
  ['05', ['infra/12-keys.sh', 'ops/rotation.py', 'policies/reports-key.json']],
  ['07', ['policies/revoke-sessions.json', 'runbooks/leaked-keys.md']],
  ['08', ['infra/12-backup.sh', 'infra/backup/shop-daily.json', 'ops/restore_drill.py']],
  ['10', ['ops/backoff_jitter.py']],
]

export function operateTree(step: string, active: string, fresh: string[] = []): TreeEntry[] {
  const files = [...COURSE_11, ...ADDS.filter(([s]) => s <= step).flatMap(([, f]) => f)]
  return projectTree(files, active, fresh,
    ['analytics', 'app', 'catalog', 'functions', 'infra', 'lake', 'policies', 'runbooks', 'sql', 'templates', 'tools', 'workers', 'workflows',
      'infra/api', 'infra/backup', 'infra/config', 'infra/dms', 'infra/dns', 'infra/events', 'infra/glue', 'infra/s3', 'infra/sns', 'infra/trail',
      'ops/evidence'],
    ['infra', 'policies'])
}
