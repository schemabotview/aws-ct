"""Run sql/daily_sales.sql on the local lake with DuckDB -- the same SQL
Athena runs -- and price what each layout makes the query scan."""
import glob
import os

import duckdb

PRICE_PER_TB = 5.00    # Athena, per TB scanned, 10 MB minimum per query
con = duckdb.connect()
con.execute("CREATE VIEW order_history AS SELECT * FROM read_parquet("
            "'lake/order_history/*/*.parquet', hive_partitioning = true)")
result = con.execute(open("sql/daily_sales.sql").read())
print(*[c[0] for c in result.description])
for row in result.fetchall():
    print(*row)

days = [f"lake/order_history/dt=2026-09-{d}/part-0.parquet"
        for d in (11, 12, 13)]
for name, files in (("by dt", days), ("flat", glob.glob("lake/flat/*"))):
    kib = sum(os.path.getsize(f) for f in files) / 1024
    big = kib * 1000 / 1024**3                     # TB, at 1,000x the orders
    print(f"{name:<6} scans {kib:>4.0f} KiB (billed as 10 MB);"
          f" at 1,000x: ${big * PRICE_PER_TB:.4f} a query")
