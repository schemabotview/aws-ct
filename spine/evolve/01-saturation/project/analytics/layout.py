"""Three ways to lay out the same month, and what one day's query must open."""
import glob
import os

import pyarrow.compute as pc
import pyarrow.dataset as ds
import pyarrow.parquet as pq

from history import september

month = september()
os.makedirs("lake/flat", exist_ok=True)
pq.write_table(month, "lake/flat/september.parquet")           # one big file
ds.write_dataset(month, "lake/order_history", format="parquet",   # dt=.../
                 partitioning=["dt"], partitioning_flavor="hive")
one_day = month.filter(pc.equal(month["dt"], "2026-09-12"))
os.makedirs("lake/tiny/dt=2026-09-12", exist_ok=True)
for i in range(200):                                    # one day as 200 files
    pq.write_table(one_day.slice(i * 10, 10),
                   f"lake/tiny/dt=2026-09-12/{i:03d}.parquet")


def kib(pattern: str) -> str:
    files = glob.glob(pattern)
    size = sum(os.path.getsize(f) for f in files)
    return f"{size / 1024:>6.0f} KiB in {len(files):>3} file(s)"


print(f"rows: {month.num_rows:,}, days: {len(set(month['dt'].to_pylist()))}")
print("one day, flat:       ", kib("lake/flat/*.parquet"))
print("one day, by dt:      ", kib("lake/order_history/dt=2026-09-12/*"))
print("one day, tiny files: ", kib("lake/tiny/dt=2026-09-12/*"))
