import type { Scene } from '@graphlearning/flow'

// §8.2 — a day of order changes arriving as CDC records (e.g. from DMS, Ch. 6): a replayed duplicate
// and a late record (event 23:58, arrived 00:04 in the next batch). Deduplicate by (order, sequence),
// place by EVENT time, then reconcile counts and totals against the source before publishing.
// source: https://docs.aws.amazon.com/dms/latest/userguide/CHAP_Target.S3.html
export const cdcReconcile: Scene = {
  id: 'cdc-reconcile',
  title: 'Duplicates, late records, and a reconciliation',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'run',
      label: '12 Oct, as it arrived',
      pattern: 'group',
      cols: 1,
      children: [
        {
          id: 'rec',
          kind: 'code',
          filename: 'reconcile.py · runs locally',
          hug: true,
          label: `# CDC records for 12 Oct as they ARRIVED: (order, seq, event_time, total)
batch = [
    ("o-501", 1, "18:04", 29.00), ("o-502", 1, "18:10", 640.00),
    ("o-501", 2, "18:05", 29.00), ("o-502", 1, "18:10", 640.00),
    ("o-503", 1, "22:15", 75.00),
]
late = [("o-504", 1, "23:58", 12.50)]  # arrived 00:04, next batch
source_count, source_total = 4, 756.50  # from the orders DB

latest = {}
for order, seq, at, total in batch + late:  # dedupe, keep latest seq
    if order not in latest or seq > latest[order][0]:
        latest[order] = (seq, total)

print("records received:", len(batch) + len(late),
      "| unique orders:", len(latest))
lake_total = sum(t for _, t in latest.values())
print(f"lake {len(latest)} orders, {lake_total:.2f}"
      f" | source {source_count} orders, {source_total:.2f}")
print("reconciled:", (len(latest), lake_total)
      == (source_count, source_total))`,
        },
        {
          id: 'rec-out',
          kind: 'code',
          filename: 'output',
          hug: true,
          label: `records received: 6 | unique orders: 4
lake 4 orders, 756.50 | source 4 orders, 756.50
reconciled: True`,
        },
      ],
    },
    {
      id: 'choices',
      kind: 'table',
      label: 'Getting data in',
      sub: 'choose by freshness and source',
      headers: ['approach', 'fits'],
      values: [
        ['nightly batch export', 'yesterday is fresh enough'],
        ['CDC (DMS)', 'every change, minutes old'],
        ['streaming (Kinesis)', 'events, seconds old'],
        ['bulk transfer (DataSync)', 'files from on-premises'],
      ],
    },
  ],
  edges: [],
}
