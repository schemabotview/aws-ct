"""A week of cost lines: who spent it (the env tag), and which line jumped."""
import csv
import statistics
from collections import defaultdict

rows = list(csv.DictReader(open("cost/week.csv")))
total = sum(float(r["usd"]) for r in rows)
by_env = defaultdict(float)
for r in rows:
    by_env[r["env"] or "untagged"] += float(r["usd"])
for env, usd in sorted(by_env.items(), key=lambda e: -e[1]):
    print(f"env={env:<9} {usd:>7.2f} USD  {usd / total:>4.0%}")

# An anomaly: a day more than 3x that line's median day.
lines = defaultdict(dict)
for r in rows:
    lines[(r["service"], r["usage"])][r["date"]] = float(r["usd"])
for (service, usage), days in lines.items():
    median = statistics.median(days.values())
    for day, usd in days.items():
        if usd > 3 * median:
            print(f"anomaly: {usage} on {day}:"
                  f" {usd:.2f} vs median {median:.2f}")
