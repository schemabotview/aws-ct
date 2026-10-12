import type { Scene } from '@graphlearning/flow'

// §11.6 — three levers measured as resource use, not carbon (runs locally; volumes assumed), and the
// constraint each one must respect. A cheaper Region is not thereby a lower-carbon one, and the
// shop's data stays in the UK. The Customer Carbon Footprint Tool reports estimated emissions.
// source: https://docs.aws.amazon.com/wellarchitected/latest/sustainability-pillar/sustainability-pillar.html
// source: https://docs.aws.amazon.com/awsaccountbilling/latest/aboutv2/what-is-ccft.html
export const sustainabilityLevers: Scene = {
  id: 'sustainability-levers',
  title: 'Less used, less moved, less kept',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'levers',
      kind: 'code',
      filename: 'footprint.py · runs locally',
      hug: true,
      label: `# resource use, not carbon: what three of the shop's choices change (assumed volumes)
LOG_GB_PER_DAY = 2.0
levers = [
    ("app servers, large-h/day", 90, 78, "medium AZ-safe"),
    ("log GB held after a year", LOG_GB_PER_DAY * 365, LOG_GB_PER_DAY * 30, "30-day retention"),
    ("GB served by the origin/month", 900, 900 * (1 - 0.9), "90% edge hits"),
]
for what, before, after, how in levers:
    print(f"{what:<30} {before:>4.0f} -> {after:>3.0f}"
          f"  ({after / before - 1:+.0%}, {how})")`,
    },
    {
      id: 'levers-out',
      kind: 'code',
      filename: 'output',
      hug: true,
      label: `app servers, large-h/day         90 ->  78  (-13%, medium AZ-safe)
log GB held after a year        730 ->  60  (-92%, 30-day retention)
GB served by the origin/month   900 ->  90  (-90%, 90% edge hits)`,
    },
    {
      id: 'constraints',
      kind: 'table',
      label: 'Each lever has a constraint',
      sub: 'state it before claiming a gain',
      headers: ['choice', 'reduces', 'constraint'],
      values: [
        ['Graviton, right size', 'energy per request', 'app tested on ARM'],
        ['scale to demand', 'idle servers', 'keep the AZ reserve'],
        ['30-day app logs', 'bytes stored', 'audit trail kept 1 year'],
        ['archive old exports', 'storage tier', 'restores take hours'],
        ['edge caching', 'repeated transfer', 'freshness (TTL)'],
        ['cheaper Region', 'price, not carbon', 'data stays in the UK'],
      ],
    },
  ],
  edges: [],
}
