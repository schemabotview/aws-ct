import type { Scene } from '@graphlearning/flow'

// §6.8 — migrating the old on-premises orders database into RDS with DMS (full load, then change data
// capture until cutover), the CLI's parameters checked against the DMS API model; and where specialist
// databases fit — selection boundaries, not courses.
// source: https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Task.CDC.html
// source: https://docs.aws.amazon.com/decision-guides/latest/decision-guides/databases-on-aws-how-to-choose.html
export const migrationAndSpecialists: Scene = {
  id: 'migration-and-specialists',
  title: 'Moving data, and when to choose something else',
  flow: 'TB',
  padding: 0.05,
  nodes: [
    {
      id: 'migration',
      label: 'Full load, then changes until cutover',
      pattern: 'group',
      cols: 2,
      children: [
        {
          id: 'task',
          kind: 'code',
          filename: 'dms-task.sh · model-checked',
          hug: true,
          label: `aws dms create-replication-task \\
  --replication-task-identifier orders-to-rds \\
  --source-endpoint-arn "$ONPREM_ENDPOINT" \\
  --target-endpoint-arn "$RDS_ENDPOINT" \\
  --replication-instance-arn "$DMS_INSTANCE" \\
  --migration-type full-load-and-cdc \\
  --table-mappings file://table-mappings.json`,
        },
        {
          id: 'mappings',
          kind: 'code',
          filename: 'table-mappings.json · illustrative',
          hug: true,
          label: `{
  "rules": [{
    "rule-type": "selection",
    "rule-id": "1",
    "rule-name": "shop-tables",
    "object-locator": {
      "schema-name": "shop",
      "table-name": "%"
    },
    "rule-action": "include"
  }]
}`,
        },
      ],
    },
    {
      id: 'specialists',
      kind: 'table',
      label: 'When a specialist database fits',
      sub: 'boundaries, not recommendations',
      headers: ['need', 'look at'],
      values: [
        ['relationships many hops deep', 'Neptune (graph)'],
        ['full-text and log search', 'OpenSearch'],
        ['analytics over years of orders', 'Redshift (Ch. 8)'],
        ['microsecond reads, durable', 'MemoryDB'],
        ['documents, MongoDB API', 'DocumentDB'],
      ],
    },
  ],
  edges: [],
}
