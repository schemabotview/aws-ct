import type { TreeEntry } from '@graphlearning/flow'
import { projectTree } from '../project'

// shop-on-aws through Course 13: Course 12's project, then the measurement, cost and decision code
// (evolve/), a week of cost lines, ADR-007, and the CDN, budget and cutover scripts.
const COURSE_12 = [
  'analytics/add_column.py', 'analytics/consumer_lag.py', 'analytics/daily_sales_duckdb.py', 'analytics/history.py',
  'analytics/layout.py', 'analytics/reconcile.py', 'app/Dockerfile', 'app/server.py', 'app/task-definition.json',
  'app/user-data.sh', 'catalog/p-1001.json', 'env.sh', 'functions/place_order/handler.py', 'infra/01-bucket.sh',
  'infra/04-guardrails.sh', 'infra/04-roles.sh', 'infra/05-dns.sh', 'infra/05-egress.sh', 'infra/05-filters.sh',
  'infra/05-lb.sh', 'infra/05-network.sh', 'infra/05-routes.sh', 'infra/06-scaling.sh', 'infra/06-template.sh',
  'infra/09-migration.sh', 'infra/10-api.sh', 'infra/10-events.sh', 'infra/10-fanout.sh', 'infra/10-function.sh',
  'infra/10-workflow.sh', 'infra/11-catalog.sh', 'infra/11-stream.sh', 'infra/12-alarm.sh', 'infra/12-backup.sh',
  'infra/12-keys.sh', 'infra/12-ops.sh', 'infra/12-trail.sh', 'infra/api/order-model.json', 'infra/backup/shop-daily.json',
  'infra/config/s3-no-public-read.json', 'infra/dms/table-mappings.json', 'infra/dns/shop-alias.json',
  'infra/events/refunds.json', 'infra/events/sample.json', 'infra/events/uk-vat.json', 'infra/glue/order-history.json',
  'infra/s3/catalog-lifecycle.json', 'infra/s3/reports-encryption.json', 'infra/sns/fraud-filter.json', 'infra/teardown.sh',
  'infra/trail/event-selectors.json', 'lake/cdc/2026-10-12.jsonl', 'lake/cdc/2026-10-13.jsonl', 'ops/backoff_jitter.py',
  'ops/error_budget.py', 'ops/evidence/2026-10-12-trail.json', 'ops/restore_drill.py', 'ops/rotation.py', 'ops/who_changed.py',
  'policies/auditor-reads.json', 'policies/order-api-access.json', 'policies/order-api-trust.json',
  'policies/order-workflow-trust.json', 'policies/place-order-fn.json', 'policies/place-order-trust.json',
  'policies/reports-bucket.json', 'policies/reports-key.json', 'policies/revoke-sessions.json', 'policies/scp-regions.json',
  'policies/shop-deploy-trust.json', 'requirements.txt', 'runbooks/leaked-keys.md', 'sql/daily_sales.sql', 'sql/place_order.sql',
  'sql/schema.sql', 'templates/filters.yaml', 'templates/network.yaml', 'templates/orders-db.yaml', 'templates/storage.yaml',
  'tools/allow_send.py', 'tools/cache_aside.py', 'tools/carts.py', 'tools/cidr_plan.py', 'tools/concurrency.py',
  'tools/connections.py', 'tools/consumer.py', 'tools/cost_ledger.py', 'tools/drain.py', 'tools/health_timeline.py',
  'tools/invoke_local.py', 'tools/last_unit.py', 'tools/orders_table.py', 'tools/presign_upload.py', 'tools/probe.py',
  'tools/purchase_mix.py', 'tools/replacement_preview.py', 'tools/route_pick.py', 'tools/run_workflow.py', 'tools/surge.py',
  'tools/traffic_shift.py', 'tools/two_writers.py', 'tools/versions.py', 'workers/ship_once.py',
  'workflows/place-order.asl.json',
]
const ADDS: [string, string[]][] = [
  ['01', ['evolve/saturation.py']],
  ['02', ['evolve/edge_latency.py', 'infra/13-cdn.sh', 'infra/cdn/distribution.json']],
  ['03', ['evolve/capacity_plans.py']],
  ['04', ['cost/week.csv', 'evolve/cost_lines.py', 'infra/13-budget.sh', 'infra/budgets/shop-prod-monthly.json']],
  ['05', ['evolve/monthly_cost.py']],
  ['06', ['evolve/footprint.py']],
  ['07', ['decisions/ADR-007.md', 'evolve/score_options.py']],
  ['09', ['evolve/region_failure.py']],
  ['10', ['evolve/cutover_gates.py', 'infra/13-cutover.sh']],
  ['11', ['evolve/priorities.py']],
]

export function evolveTree(step: string, active: string, fresh: string[] = []): TreeEntry[] {
  const files = [...COURSE_12, ...ADDS.filter(([s]) => s <= step).flatMap(([, f]) => f)]
  return projectTree(files, active, fresh,
    ['analytics', 'app', 'catalog', 'cost', 'decisions', 'functions', 'infra', 'lake', 'ops', 'policies', 'runbooks', 'sql', 'templates', 'tools',
      'workers', 'workflows', 'infra/api', 'infra/backup', 'infra/budgets', 'infra/cdn', 'infra/config', 'infra/dms', 'infra/dns', 'infra/events',
      'infra/glue', 'infra/s3', 'infra/sns', 'infra/trail'],
    ['infra', 'policies'])
}
