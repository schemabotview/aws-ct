"""The review's findings, ranked by value for the effort: what to fix first.
Value and effort are the review's own 1-10 estimates, written down."""
FINDINGS = [  # (pillar, finding, value, effort)
    ("security", "every service re-reads secrets on rotation", 8, 2),
    ("operational", "link the runbook from each alarm", 4, 1),
    ("reliability", "test a restore in the second Region", 9, 3),
    ("cost", "S3 gateway endpoint: stop paying NAT for S3", 6, 2),
    ("cost", "tag the untagged 2%", 3, 1),
    ("sustainability", "30-day retention on every log group", 3, 1),
    ("performance", "pool sizes per server: fix the p99 tail", 6, 3),
    ("reliability", "multi-Region active/active", 5, 5),
]
ranked = sorted(FINDINGS, key=lambda f: -f[2] / f[3])
for n, (pillar, finding, value, effort) in enumerate(ranked, 1):
    print(f"{n}. {value / effort:.1f}  {pillar:<14} {finding}")
