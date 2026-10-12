import type { Scene } from '@graphlearning/flow'

// §11.3 — the same day of demand under four capacity plans (runs locally). AZ-safe means losing one
// of three AZs leaves enough: the other two carry all the traffic. medium = half a large at half the
// price (an ASSUMPTION of the hypothetical rate card); smaller units waste less on each step.
// source: https://docs.aws.amazon.com/compute-optimizer/latest/ug/what-is-compute-optimizer.html
export const capacityPlans: Scene = {
  id: 'capacity-plans',
  title: 'Idle capacity: waste or reserve?',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'capacity-plot',
      kind: 'plot',
      label: 'AZ-safe capacity against demand, one day',
      sub: 'req/s',
      plot: {
        x: { min: 0, max: 24, step: 6, label: 'hour' },
        y: { min: 0, max: 1000, step: 200, label: 'req/s' },
        axes: 'corner',
        series: [
          { kind: 'line', label: 'large servers', color: 'warn', dashed: true, points: [[0, 450], [18, 450], [18, 900], [24, 900]], labelAt: [1, 500] },
          { kind: 'line', label: 'medium servers', color: 'network', dashed: true, points: [[0, 225], [8, 225], [8, 450], [18, 450], [18, 900], [24, 900]], labelAt: [1, 275] },
          { kind: 'area', label: 'demand', color: 'service', points: [[0, 60], [8, 60], [8, 240], [18, 240], [18, 560], [24, 560]], labelAt: [9, 140] },
        ],
      },
    },
    {
      id: 'plans',
      kind: 'code',
      filename: 'capacity_plans.py · runs locally',
      hug: true,
      label: `from math import ceil

BANDS = [(8, 60), (10, 240), (6, 560)]      # (hours, req/s): the shop's day
work = sum(h * r for h, r in BANDS) / 150   # large-server-hours of real work


def az_safe(rate, per_server):   # lose one AZ: the other two carry it all
    return 3 * ceil(rate / 2 / per_server)


plans = {
    "fixed: 4 large": [4 for _ in BANDS],
    "elastic large, no AZ reserve": [ceil(r / 150) for _, r in BANDS],
    "elastic large, AZ-safe": [az_safe(r, 150) for _, r in BANDS],
    "elastic medium, AZ-safe": [az_safe(r, 75) / 2 for _, r in BANDS],
}
for name, servers in plans.items():
    hours = sum(h * s for (h, _), s in zip(BANDS, servers))
    print(f"{name:<29} {hours:>3.0f} large-h/day   busy {work / hours:4.0%}")`,
    },
    {
      id: 'plans-out',
      kind: 'code',
      filename: 'output',
      hug: true,
      label: `fixed: 4 large                 96 large-h/day   busy  43%
elastic large, no AZ reserve   52 large-h/day   busy  80%
elastic large, AZ-safe         90 large-h/day   busy  46%
elastic medium, AZ-safe        78 large-h/day   busy  53%`,
    },
  ],
  edges: [],
}
