import type { Scene } from '@graphlearning/flow'

// §10.9 — RPO by incident: each copy answers a different failure. A synchronous standby has zero lag
// but also the bad UPDATE; PITR answers corruption (logs shipped about every 5 minutes, an assumption
// from secondary sources); only the cross-Region copy survives a Region — with up to a day lost if it
// is nightly. Strategies from the AWS DR guidance, cheapest/slowest to dearest/fastest.
// source: https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html
export const disasterRecovery: Scene = {
  id: 'disaster-recovery',
  title: 'Which copy survives which incident?',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'rpo',
      kind: 'code',
      filename: 'rpo_by_incident.py · runs locally',
      hug: true,
      label: `# copies of the orders data, and how old the newest usable one is
copies = {
    "Multi-AZ standby": "0 min, but has the bad UPDATE too",
    "PITR (same Region)": 5,          # transaction logs shipped often
    "nightly cross-Region copy": 24 * 60,
}
scenarios = [
    ("AZ lost", ["Multi-AZ standby"]),
    ("bad UPDATE (corruption)", ["PITR (same Region)"]),
    ("Region lost", ["nightly cross-Region copy"]),
]
for incident, usable in scenarios:
    best = usable[0]
    age = copies[best]
    rpo = age if isinstance(age, str) else f"up to {age} min"
    print(f"{incident:<24} -> {best}: {rpo}")`,
    },
    {
      id: 'rpo-out',
      kind: 'code',
      filename: 'output',
      hug: true,
      label: `AZ lost                  -> Multi-AZ standby: 0 min, but has the bad UPDATE too
bad UPDATE (corruption)  -> PITR (same Region): up to 5 min
Region lost              -> nightly cross-Region copy: up to 1440 min`,
    },
    {
      id: 'strategies',
      kind: 'table',
      label: 'Regional DR strategies',
      sub: 'cost rises as RTO and RPO fall',
      headers: ['strategy', 'in the second Region', 'RTO'],
      values: [
        ['backup & restore', 'backups + templates', 'hours'],
        ['pilot light', 'data live, compute off', 'tens of minutes'],
        ['warm standby', 'small working copy', 'minutes'],
        ['multi-site active/active', 'full capacity', 'near zero'],
      ],
    },
  ],
  edges: [],
}
