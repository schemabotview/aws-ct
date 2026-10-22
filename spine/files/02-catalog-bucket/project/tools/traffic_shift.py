"""A bad release, three ways: how many requests fail before the alarm?

A model, not AWS: order-api 1.5.0 fails 2% of requests, the error alarm
stops the deployment after 2 minutes, and it is the 560 req/s evening peak.
"""
RATE, FAILING, ALARM_MINUTES = 560, 0.02, 2

STRATEGIES = {  # share of traffic on the new version, minute by minute
    "all at once": [1.0, 1.0],
    "linear, 10% more a minute": [0.1, 0.2],
    "canary 10%, then the rest": [0.1, 0.1],
}
for name, shares in STRATEGIES.items():
    minutes = shares[:ALARM_MINUTES]
    failed = sum(RATE * 60 * share * FAILING for share in minutes)
    print(f"{name:28} {failed:6.0f} failed requests before the alarm")
