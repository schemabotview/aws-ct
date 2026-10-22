"""September 2026's order history: 2,000 orders a day, the same every run."""
import datetime as dt
import random

import pyarrow as pa

PRODUCTS = {"p-1001": 10.00, "p-1002": 4.50, "p-1003": 18.00, "p-1004": 64.00}


def september(per_day: int = 2000, seed: int = 12) -> pa.Table:
    rng, rows = random.Random(seed), []
    for d in range(30):
        day = dt.date(2026, 9, 1) + dt.timedelta(days=d)
        for i in range(per_day):
            product = rng.choice(list(PRODUCTS))
            qty = rng.randint(1, 4)
            rows.append({"order": f"o-{d:02d}{i:04d}", "dt": day.isoformat(),
                         "customer": f"c-{rng.randint(1, 9000)}",
                         "product": product, "qty": qty,
                         "total": round(qty * PRODUCTS[product], 2),
                         "country": rng.choice(["GB", "GB", "GB", "IE", "FR"])})
    return pa.Table.from_pylist(rows)
