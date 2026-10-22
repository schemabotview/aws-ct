"""The dev account's month, at the course's HYPOTHETICAL rates (USD)."""
RATE = {"instance": 0.04, "volume": 0.08, "ipv4": 0.005,
        "snapshot": 0.05, "s3": 0.023}
LEDGER = [  # item, meter, quantity, still billed when the server is stopped?
    ("dev server, 730 h", "instance", 730, False),
    ("its volume, 20 GB", "volume", 20, True),
    ("public IPv4, 730 h", "ipv4", 730, True),
    ("snapshot, 20 GB", "snapshot", 20, True),
    ("catalog bucket, 33 GB", "s3", 33, True),
]
running = stopped = 0.0
print(f"{'item':24}{'running':>10}{'stopped':>10}")
for item, meter, quantity, still_billed in LEDGER:
    cost = round(RATE[meter] * quantity, 2)
    running += cost
    stopped += cost if still_billed else 0.0
    print(f"{item:24}{cost:>10.2f}{cost if still_billed else 0:>10.2f}")
print(f"{'total a month':24}{running:>10.2f}{stopped:>10.2f}")
