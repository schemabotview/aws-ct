import type { Scene } from '@graphlearning/flow'

// §8.3 — layout measured, not asserted: a seeded month of order history (60,000 rows) written as
// Parquet three ways; a query for one day opens 629 KiB unpartitioned, 24 KiB with hive-style dt=
// partitions, and the same day as 200 tiny files is 220 KiB across 200 opens. Columnar Parquet also
// lets an engine read only the columns a query names.
// source: https://docs.aws.amazon.com/athena/latest/ug/partitions.html
// source: https://docs.aws.amazon.com/athena/latest/ug/performance-tuning.html
export const lakeLayout: Scene = {
  id: 'lake-layout',
  title: 'Layout decides what a query reads',
  flow: 'TB',
  padding: 0.05,
  nodes: [
    {
      id: 'layout',
      kind: 'code',
      filename: 'layout.py · runs locally',
      hug: true,
      label: `import os
import random
import tempfile

import pyarrow as pa
import pyarrow.compute  # noqa: F401  (pa.compute)
import pyarrow.dataset as ds
import pyarrow.parquet as pq

random.seed(12)
days = [f"2026-09-{d:02d}" for d in range(1, 31)]
table = pa.table({
    "dt": [d for d in days for _ in range(2000)],
    "order_id": [f"o-{n}" for n in range(60000)],
    "total": [round(random.uniform(5, 200), 2) for _ in range(60000)],
})

root = tempfile.mkdtemp()
flat, parted = f"{root}/flat", f"{root}/by_dt"
pq.write_to_dataset(table, flat)  # everything in one place
pq.write_to_dataset(table, parted,
                    partition_cols=["dt"])  # dt=.../ folders


def opened(path, flt=None):  # files a query on 12 Sep must read
    data = ds.dataset(path, partitioning="hive")
    files = [f.path for f in data.get_fragments(filter=flt)]
    return len(files), sum(os.path.getsize(f) for f in files)


tiny = f"{root}/tiny"  # the same one day, as a stream of small files
ds.write_dataset(table.filter(pa.compute.equal(table["dt"], "2026-09-12")),
                 tiny, format="parquet", max_rows_per_file=10,
                 max_rows_per_group=10)

one_day = ds.field("dt") == "2026-09-12"
for name, path, flt in [("unpartitioned", flat, None),
                        ("dt= partitions", parted, one_day),
                        ("200 tiny files", tiny, None)]:
    n, size = opened(path, flt)
    print(f"{name:<15} {n:>3} file(s), {size / 1024:>6.0f} KiB opened")`,
    },
    {
      id: 'layout-out',
      kind: 'code',
      filename: 'output',
      hug: true,
      label: `unpartitioned     1 file(s),    629 KiB opened
dt= partitions    1 file(s),     24 KiB opened
200 tiny files  200 file(s),    220 KiB opened`,
    },
  ],
  edges: [],
}
