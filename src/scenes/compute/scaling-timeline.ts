import type { Scene } from '@graphlearning/flow'

// §4.5 — the 18:00 surge: demand rises from 240 to 560 req/s over four minutes. Reactive scaling
// (3 servers, keep 25% headroom, metrics a minute late, an ASSUMED 5 min from launch to in service)
// is short for 5 minutes; a scheduled action raising the minimum to 6 at 17:45 is never short. The
// scheduled-action request is validated in full against the Auto Scaling API.
// source: https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-scheduled-scaling.html
export const scalingTimeline: Scene = {
  id: 'scaling-timeline',
  title: 'Capacity arrives late',
  flow: 'TB',
  padding: 0.05,
  nodes: [
    {
      id: 'surge',
      kind: 'code',
      filename: 'surge.py · runs locally',
      hug: true,
      label: `import math

PER_SERVER, TARGET = 150, 0.75  # req/s; keep 25% headroom
DELAY = 5  # minutes from launch to in service (assumed)


def demand(m):  # m = minutes after 17:50
    return 240 if m < 10 else min(560, 240 + 80 * (m - 9))


def run(start):
    serving, arriving, short = start, [], []
    for m in range(31):
        serving += arriving.count(m)
        seen = demand(max(m - 1, 0))  # metrics lag a minute
        want = max(3, math.ceil(seen / (PER_SERVER * TARGET)))
        on_way = sum(t > m for t in arriving)
        arriving += [m + DELAY] * max(0, want - serving - on_way)
        gap = demand(m) - serving * PER_SERVER
        if gap > 0:
            short.append((m, gap))
    return short


for name, start in [("reactive only", 3), ("scheduled 6", 6)]:
    s = run(start)
    worst = max((g for _, g in s), default=0)
    print(f"{name:<14} {len(s):>2} min short, worst {worst} req/s")`,
    },
    {
      id: 'surge-out',
      kind: 'code',
      filename: 'output',
      hug: true,
      label: `reactive only   5 min short, worst 110 req/s
scheduled 6     0 min short, worst 0 req/s`,
    },
    {
      id: 'schedule',
      kind: 'code',
      filename: 'autoscaling.PutScheduledUpdateGroupAction.request.json · model-checked',
      hug: true,
      label: `{
  "AutoScalingGroupName": "order-api",
  "ScheduledActionName": "evening-peak",
  "Recurrence": "45 17 * * *",
  "TimeZone": "Europe/London",
  "MinSize": 6
}`,
    },
  ],
  edges: [],
}
