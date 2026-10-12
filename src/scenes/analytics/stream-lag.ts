import type { Scene } from '@graphlearning/flow'

// §8.6 — a Kinesis DATA STREAMS consumer falling behind (the variant is named: provisioned, 2 shards;
// each shard takes 1 MB/s or 1,000 records/s in and serves 2 MB/s out; retention 24 h by default, up
// to 365 days; order is per shard, i.e. per partition key). Clickstream at 1,800/s against a consumer
// handling 1,600/s builds a backlog — the iterator age — that drains after 20:00. Firehose, by
// contrast, buffers and delivers to S3 with no consumer code.
// source: https://docs.aws.amazon.com/streams/latest/dev/service-sizes-and-limits.html
// source: https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html
export const streamLag: Scene = {
  id: 'stream-lag',
  title: 'A consumer that cannot keep up',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'lag',
      kind: 'code',
      filename: 'consumer_lag.py · runs locally',
      hug: true,
      label: `SHARDS = 2
WRITE_LIMIT = 1000 * SHARDS    # records/s the stream accepts
CONSUMER = 800 * SHARDS        # records/s our consumer handles
RETENTION_H = 24               # default retention

backlog = 0
for clock, produced in [("18:00", 1500), ("18:30", 1800),
                        ("19:00", 1800), ("19:30", 1800),
                        ("20:00", 900), ("20:30", 900)]:
    assert produced <= WRITE_LIMIT
    backlog = max(0, backlog + (produced - CONSUMER) * 1800)
    age_min = backlog / CONSUMER / 60  # how far behind the reader is
    print(f"{clock} in {produced:>4}/s  backlog {backlog:>9,}"
          f"  iterator age ~{age_min:4.1f} min")
print(f"records are lost only if age exceeds {RETENTION_H} h")`,
    },
    {
      id: 'lag-out',
      kind: 'code',
      filename: 'output',
      hug: true,
      label: `18:00 in 1500/s  backlog         0  iterator age ~ 0.0 min
18:30 in 1800/s  backlog   360,000  iterator age ~ 3.8 min
19:00 in 1800/s  backlog   720,000  iterator age ~ 7.5 min
19:30 in 1800/s  backlog 1,080,000  iterator age ~11.2 min
20:00 in  900/s  backlog         0  iterator age ~ 0.0 min
20:30 in  900/s  backlog         0  iterator age ~ 0.0 min
records are lost only if age exceeds 24 h`,
    },
    {
      id: 'create',
      kind: 'code',
      filename: 'kinesis.CreateStream.request.json · model-checked',
      hug: true,
      label: `{
  "StreamName": "shop-clickstream",
  "ShardCount": 2,
  "StreamModeDetails": { "StreamMode": "PROVISIONED" }
}`,
    },
  ],
  edges: [],
}
