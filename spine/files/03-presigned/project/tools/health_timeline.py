"""When does the load balancer stop, and start again, sending to app-3?

A model of the target group's health checks, not AWS: app-3 stops answering
/health at 0 s and answers again from 60 s. Checks run every 10 s.
"""
INTERVAL, UNHEALTHY, HEALTHY = 10, 2, 3  # the shop-app target group
DOWN, BACK = 0, 60

state, fails, oks = "healthy", 0, 0
for t in range(5, 100, INTERVAL):
    ok = not DOWN <= t < BACK
    fails, oks = (0, oks + 1) if ok else (fails + 1, 0)
    before = state
    if state == "healthy" and fails >= UNHEALTHY:
        state = "unhealthy"
    elif state == "unhealthy" and oks >= HEALTHY:
        state = "healthy"
    change = f"   app-3 now {state}" if state != before else ""
    print(f"{t:>3} s  /health {'200' if ok else 'no answer':9}{change}".rstrip())
for targets in (6, 5):
    print(f"560 req/s over {targets} targets: {560 // targets} each")
