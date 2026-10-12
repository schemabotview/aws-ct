import type { Scene } from '@graphlearning/flow'

// §8.5 — the annotated aggregation and its rows. Athena is not available here, so the SAME standard
// SQL runs in DuckDB over the same hive-partitioned Parquet (labelled on the card); Athena runs it as
// Trino SQL over S3. The StartQueryExecution CLI's parameters are checked against the Athena model. Athena bills bytes scanned
// ($5/TB published, 10 MB minimum per query — treat as hypothetical in the course's ledgers).
// source: https://aws.amazon.com/athena/pricing/
export const athenaQuery: Scene = {
  id: 'athena-query',
  title: 'SQL over files, billed by bytes read',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'query',
      kind: 'code',
      filename: 'daily_sales_duckdb.py · runs locally',
      hug: true,
      label: `import random
import tempfile

import duckdb
import pyarrow as pa
import pyarrow.parquet as pq

random.seed(12)  # the same September history as the layout example
days = [f"2026-09-{d:02d}" for d in range(1, 31)]
root = tempfile.mkdtemp()
pq.write_to_dataset(pa.table({
    "dt": [d for d in days for _ in range(2000)],
    "order_id": [f"o-{n}" for n in range(60000)],
    "total": [round(random.uniform(5, 200), 2) for _ in range(60000)],
}), root, partition_cols=["dt"])  # dt=YYYY-MM-DD/ folders

print(duckdb.sql(f"""
    SELECT dt, count(*) AS orders, round(sum(total), 2) AS sales
    FROM read_parquet('{root}/*/*.parquet', hive_partitioning = true)
    WHERE dt BETWEEN '2026-09-11' AND '2026-09-13'
    GROUP BY dt ORDER BY dt
"""))`,
    },
    {
      id: 'query-out',
      kind: 'code',
      filename: 'output',
      hug: true,
      label: `┌────────────┬────────┬───────────┐
│     dt     │ orders │   sales   │
│    date    │ int64  │  double   │
├────────────┼────────┼───────────┤
│ 2026-09-11 │   2000 │ 202224.52 │
│ 2026-09-12 │   2000 │ 205617.39 │
│ 2026-09-13 │   2000 │  202876.5 │
└────────────┴────────┴───────────┘`,
    },
    {
      id: 'start',
      kind: 'code',
      filename: 'athena.sh · model-checked',
      hug: true,
      label: `# the same SELECT, saved as daily_sales.sql
aws athena start-query-execution \\
  --query-string file://daily_sales.sql \\
  --query-execution-context Database=shop_lake \\
  --work-group analysts`,
    },
  ],
  edges: [],
}
