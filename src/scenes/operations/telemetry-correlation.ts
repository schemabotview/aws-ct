import type { Scene } from '@graphlearning/flow'

// §10.1 — a latency incident correlated across signals: metrics say p99 jumped from 132 ms to
// 1,020 ms between 18:04 and 18:06 while p50 barely moved; the structured logs, joined by trace id to
// their spans (X-Ray), show 90% of the slow traces' time waiting for a database connection — the
// Ch. 6 pool. Logs and traces are retained only as long as configured.
// source: https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html
// source: https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/WhatIsCloudWatchLogs.html
export const telemetryCorrelation: Scene = {
  id: 'telemetry-correlation',
  title: 'Metrics say when, traces say where',
  flow: 'TB',
  padding: 0.05,
  nodes: [
    {
      id: 'signals',
      label: 'Three signals, one request id',
      pattern: 'group',
      cols: 3,
      children: [
        { id: 's-metric', label: 'Metric', sub: 'p99 latency, per minute', pattern: 'service', icon: 'cloudwatch' },
        { id: 's-log', label: 'Structured log', sub: 'JSON, trace_id field', pattern: 'storage', icon: 'scroll' },
        { id: 's-trace', label: 'Trace', sub: 'spans: app → DB wait', pattern: 'network', icon: 'workflow' },
      ],
    },
    {
      id: 'traces',
      kind: 'code',
      filename: 'latency_incident.py · runs locally',
      hug: true,
      label: `from statistics import quantiles

# structured request logs; trace_id joins them to their spans
logs = []
for i in range(400):
    minute = "18:04" if i < 200 else "18:06"
    db_wait = i % 5                      # ms waiting for a connection
    if minute == "18:06" and i % 10 == 0:
        db_wait = 900                    # pool exhausted on some calls
    logs.append({"minute": minute, "trace_id": f"1-{i:04x}",
                 "ms": 90 + (i * 7) % 40 + db_wait,
                 "db_wait_ms": db_wait})

for minute in ("18:04", "18:06"):
    ms = [r["ms"] for r in logs if r["minute"] == minute]
    q = quantiles(ms, n=100)
    print(f"{minute}  p50 {q[49]:>5.0f} ms   p99 {q[98]:>5.0f} ms")

slow = [r for r in logs if r["ms"] > 500]
share = sum(r["db_wait_ms"] for r in slow) / sum(r["ms"] for r in slow)
print(f"{len(slow)} slow traces; {share:.0%} of their time:",
      "waiting for a DB connection")`,
    },
    {
      id: 'traces-out',
      kind: 'code',
      filename: 'output',
      hug: true,
      label: `18:04  p50   112 ms   p99   132 ms
18:06  p50   114 ms   p99  1020 ms
20 slow traces; 90% of their time: waiting for a DB connection`,
    },
  ],
  edges: [],
}
