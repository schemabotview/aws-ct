"""Checkout's objective, its error budget, and how fast errors spend it."""
OBJECTIVE = 0.999        # 99.9% of checkout requests succeed...
WINDOW_DAYS = 30         # ...over any 30 days
RATE = 6                 # checkout requests a second, on average
requests = RATE * 86_400 * WINDOW_DAYS
budget = requests * (1 - OBJECTIVE)
print(f"{requests:,} requests in {WINDOW_DAYS} days,"
      f" {budget:,.0f} may fail")
for errors in (0.001, 0.02, 0.10):          # share of requests failing
    burn = errors / (1 - OBJECTIVE)         # how many times too fast
    hours = WINDOW_DAYS * 24 / burn
    print(f"{errors:>5.1%} failing: burn {burn:>3.0f}x,"
          f" budget gone in {hours:>5.1f} h")

# Page a human only for a FAST burn: about 14x, sustained for 5 minutes.
per_minute = RATE * 60 * (1 - OBJECTIVE) * 14
print(f"page when 5xx > {per_minute:.0f} a minute, 5 minutes running")
