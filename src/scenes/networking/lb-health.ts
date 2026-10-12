import type { Scene } from '@graphlearning/flow'

// §3.8 — a target group with health checks set explicitly (never relying on defaults: interval 10 s,
// 2 failures to mark unhealthy, 3 successes to recover), and a computed timeline for app-3 failing at
// t=0 and being fixed at t=60 s. The load spread uses the fixed 560 req/s evening peak.
// source: https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html
export const lbHealth: Scene = {
  id: 'lb-health',
  title: 'Health checks decide who gets traffic',
  flow: 'TB',
  padding: 0.05,
  nodes: [
    {
      id: 'tg',
      kind: 'code',
      filename: 'target-group.sh · model-checked',
      hug: true,
      label: `aws elbv2 create-target-group --name shop-app \\
  --protocol HTTP --port 8080 --vpc-id vpc-shop-prod \\
  --health-check-path /health \\
  --health-check-interval-seconds 10 \\
  --unhealthy-threshold-count 2 \\
  --healthy-threshold-count 3`,
    },
    {
      id: 'timeline',
      kind: 'code',
      filename: 'health_timeline.py · runs locally',
      hug: true,
      label: `INTERVAL, UNHEALTHY, HEALTHY = 10, 2, 3
DOWN, BACK = 0, 60  # app-3 fails at t=0 s, is fixed at t=60 s
checks = range(5, 120, INTERVAL)  # a check every 10 s

fails = oks = 0
state = "healthy"
for t in checks:
    ok = not (DOWN <= t < BACK)
    fails, oks = (0, oks + 1) if ok else (fails + 1, 0)
    if state == "healthy" and fails == UNHEALTHY:
        state = "unhealthy"
        print(f"t={t:>3}s app-3 unhealthy: traffic stops")
    if state == "unhealthy" and oks == HEALTHY:
        state = "healthy"
        print(f"t={t:>3}s app-3 healthy: traffic resumes")

load = 560
print(f"6 targets: {load / 6:.0f} req/s each;",
      f"5 targets: {load / 5:.0f} req/s each")`,
    },
    {
      id: 'timeline-out',
      kind: 'code',
      filename: 'output',
      hug: true,
      label: `t= 15s app-3 unhealthy: traffic stops
t= 85s app-3 healthy: traffic resumes
6 targets: 93 req/s each; 5 targets: 112 req/s each`,
    },
  ],
  edges: [
    { source: 'tg', target: 'timeline', label: 'same thresholds' },
    { source: 'timeline', target: 'timeline-out' },
  ],
}
