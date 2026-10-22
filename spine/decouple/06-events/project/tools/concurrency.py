"""place-order at the evening peak: environments needed, and what 50 allows."""
PEAK = 560          # requests per second, 18-24 h
DURATION = 0.12     # seconds per invocation (assumed)
RESERVED = 50       # reserved concurrency: a ceiling, and a guarantee

needed = PEAK * DURATION                  # Little's law: rate x time in system
ceiling = RESERVED / DURATION             # the most it can finish per second
print(f"needed at peak:  {needed:.0f} concurrent")
print(f"ceiling with {RESERVED}: {ceiling:.0f} req/s")
print(f"throttled:       {PEAK - ceiling:.0f} req/s (429 to the API)")
print(f"downstream:      never more than {RESERVED} writers at once")
