"""Change records -> one row per order, on the day it was COMMITTED, then
checked against the source database's own total for that day."""
import glob
import json

SOURCE_TOTAL = 756.50     # sum(total) of the orders placed on 12 Oct, at source
DAY = "2026-10-12"

# Naive: every record in the day's file, as it arrived.
naive = [json.loads(line) for line in open(f"lake/cdc/{DAY}.jsonl")]
print(f"naive:      {len(naive)} records,"
      f" sum {sum(r['total'] for r in naive):.2f}")

# Reconciled: read every file, keep each order's LAST change (by log position),
# and put it on the day it was committed, not the day it arrived.
latest = {}
for path in sorted(glob.glob("lake/cdc/*.jsonl")):
    for r in map(json.loads, open(path)):
        if r["order"] not in latest or r["lsn"] >= latest[r["order"]]["lsn"]:
            latest[r["order"]] = r
day = [r for r in latest.values() if r["at"].startswith(DAY)]
total = sum(r["total"] for r in day)
verdict = "match" if total == SOURCE_TOTAL else "MISMATCH"
print(f"reconciled: {len(day)} orders,  sum {total:.2f}"
      f" - source {SOURCE_TOTAL:.2f}: {verdict}")
