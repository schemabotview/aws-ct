import type { Scene } from '@graphlearning/flow'

// §11.1 — latency against utilisation for one app server, from a queueing simulation (15 workers,
// ~100 ms each = the fixed 150 req/s per server). A model, not a measurement of AWS: it shows why
// p99 bends upward well before 100% busy, and why the tail, not the mean, shows saturation first.
// source: https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html
// source: https://docs.aws.amazon.com/wellarchitected/latest/performance-efficiency-pillar/welcome.html
export const saturationCurve: Scene = {
  id: 'saturation-curve',
  title: 'The tail bends before the server is full',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'saturation',
      kind: 'code',
      filename: 'saturation.py · runs locally',
      hug: true,
      label: `import heapq
import random
from statistics import quantiles

random.seed(7)
WORKERS = 15            # one app server: 15 workers x ~100 ms = 150 req/s


def serve(rate, n=50_000):
    free = [0.0] * WORKERS              # when each worker is next free
    t, ms = 0.0, []
    for _ in range(n):
        t += random.expovariate(rate)   # requests arrive at random
        start = max(t, heapq.heappop(free))
        done = start + 0.080 + random.expovariate(50)   # 80 ms + ~20 ms
        heapq.heappush(free, done)
        ms.append((done - t) * 1000)
    q = quantiles(ms, n=100)
    return q[49], q[98]


for rate in (60, 120, 140, 147):
    p50, p99 = serve(rate)
    print(f"{rate:>3} req/s  busy {rate / 150:4.0%}"
          f"  p50 {p50:4.0f} ms  p99 {p99:5.0f} ms")`,
    },
    {
      id: 'result',
      label: 'Result, and where to look',
      pattern: 'group',
      cols: 2,
      children: [
        {
          id: 'saturation-out',
          kind: 'code',
          filename: 'output',
          hug: true,
          label: ` 60 req/s  busy  40%  p50   94 ms  p99   171 ms
120 req/s  busy  80%  p50   99 ms  p99   187 ms
140 req/s  busy  93%  p50  123 ms  p99   299 ms
147 req/s  busy  98%  p50  206 ms  p99   873 ms`,
        },
        {
          id: 'signals',
          kind: 'table',
          label: 'Where saturation shows first',
          sub: 'one signal per resource the request uses',
          headers: ['resource', 'saturation signal'],
          values: [
            ['app server', 'CPU near 100%, p99 rising'],
            ['DB connections', 'pool waits (Ch. 10)'],
            ['Lambda', 'Throttles metric'],
            ['SQS consumer', 'age of oldest message'],
            ['Kinesis consumer', 'iterator age (Ch. 8)'],
          ],
        },
      ],
    },
  ],
  edges: [],
}
