import type { Scene } from '@graphlearning/flow'

// §4.3 — instance-type anatomy and a purchase mix for one month of the order platform, from the
// course's HYPOTHETICAL rate card (on-demand $0.04/h, a 30%-off commitment, Spot at $0.016/h).
// m7g.large = general purpose (m), 7th generation, Graviton (g, Arm64), large: 2 vCPU, 8 GiB.
// source: https://aws.amazon.com/ec2/instance-types/m7g/
export const purchaseOptions: Scene = {
  id: 'purchase-options',
  title: 'Instance types and how to pay for them',
  flow: 'TB',
  padding: 0.05,
  nodes: [
    {
      id: 'anatomy',
      label: 'Reading m7g.large',
      pattern: 'group',
      cols: 2,
      children: [
        { id: 'a-family', label: 'm', sub: 'general purpose', pattern: 'service', icon: 'cpu' },
        { id: 'a-gen', label: '7', sub: 'generation', pattern: 'service', icon: 'history' },
        { id: 'a-proc', label: 'g', sub: 'Graviton, Arm64', pattern: 'warn', icon: 'gears' },
        { id: 'a-size', label: 'large', sub: '2 vCPU, 8 GiB', pattern: 'service', icon: 'ruler' },
      ],
    },
    {
      id: 'mix',
      kind: 'code',
      filename: 'purchase_mix.py · runs locally',
      hug: true,
      label: `# Hypothetical USD rates -- not a price quote
ON_DEMAND = 0.04   # per instance-hour
COMMITTED = 0.028  # 30% off for a 1-year commitment
SPOT = 0.016       # interruptible spare capacity
DAYS = 30

fleet = [
    # (part, instances, hours a day, best option)
    ("baseline, 1 per AZ", 3, 24, COMMITTED),
    ("evening peak", 3, 6, ON_DEMAND),
    ("image worker", 2, 4, SPOT),
]
total = all_od = 0
for part, n, h, rate in fleet:
    hours = n * h * DAYS
    total += hours * rate
    all_od += hours * ON_DEMAND
    print(f"{part:<19}{hours:>5} h  \${hours * rate:>6.2f}")
print(f"{'mixed purchase':<26}\${total:>6.2f}")
print(f"{'all on-demand':<26}\${all_od:>6.2f}")`,
    },
    {
      id: 'mix-out',
      kind: 'code',
      filename: 'output',
      hug: true,
      label: `baseline, 1 per AZ  2160 h  $ 60.48
evening peak         540 h  $ 21.60
image worker         240 h  $  3.84
mixed purchase            $ 85.92
all on-demand             $117.60`,
    },
  ],
  edges: [],
}
