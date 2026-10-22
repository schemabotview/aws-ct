"""Production's month, priced with a HYPOTHETICAL rate card (USD), so the
shape of the bill is real even though the prices are not AWS's."""
RATE = {"nat_hour": 0.05, "nat_gb": 0.05, "egress_gb": 0.09,
        "cross_az_gb": 0.02, "logs_gb": 0.50, "backup_gb": 0.05,
        "s3_gb": 0.023, "large_hour": 0.04, "committed_hour": 0.028}
HOURS = 730                                         # in a month

lines = {
    "NAT gateways (3)": 3 * HOURS * RATE["nat_hour"],
    "app servers (90 large-h/day)": 90 * 30 * RATE["large_hour"],
    "internet egress (900 GB)": 900 * RATE["egress_gb"],
    "logs ingested (60 GB)": 60 * RATE["logs_gb"],
    "backups (300 GB)": 300 * RATE["backup_gb"],
    "cross-AZ traffic (400 GB)": 400 * RATE["cross_az_gb"],
    "NAT processing (120 GB)": 120 * RATE["nat_gb"],
    "S3 storage (200 GB)": 200 * RATE["s3_gb"],
}
for name, usd in lines.items():
    print(f"{name:<30} {usd:>7.2f}")
print(f"{'total':<30} {sum(lines.values()):>7.2f}")

base = 3 * 24 * 30                                  # the 3 always-on servers
mixed = (base * RATE["committed_hour"]
         + (90 * 30 - base) * RATE["large_hour"])
print(f"servers, 3 committed + rest on demand: {mixed:.2f}"
      f" (commit pays off above"
      f" {RATE['committed_hour'] / RATE['large_hour']:.0%} use)")
