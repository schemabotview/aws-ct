import type { Section } from '../types'

export const kinesisStreaming: Section = {
  id: 'kinesis-streaming',
  title: 'Kinesis streaming choices, ordering scope, retention, and consumer lag',
  scene: 'stream-lag',
  focus: 'lag-out',
  slide: `## Kinesis: streams and consumer lag

**Objective:** spot a consumer falling behind.

### Mental model
- **Kinesis Data Streams**: shards, ordered **per partition key**
- Shard: **1,000 records/s** in · retention **24 h**
- **Iterator age**: how far behind the reader is
- **Data Firehose**: buffers and delivers to S3, no consumer code

### Worked example: clickstream, 2 shards
- 1,800 records/s in, consumer handles **1,600/s**
- Iterator age **~11 min** by 19:30
- Drains after 20:00; nothing lost

### Misconception
- "It's in the stream, so it's processed" — watch the iterator age

### Explanation summary
- Size shards for input and consumers for output`,
  narration:
    "Some data cannot wait for a nightly batch. The shop's clickstream, every product view and add to basket, feeds near real time recommendations. A stream carries it. Which Kinesis service matters, so let's be precise. Kinesis Data Streams stores records in shards. Each record has a partition key, and ordering is guaranteed only within a shard, so only per key. Each shard accepts up to one megabyte or one thousand records a second, and records are kept for twenty four hours by default, extendable to a year. Consumers read at their own pace, and the distance between the newest record and where a consumer is reading is its iterator age. Kinesis Data Firehose is a different service: it buffers incoming records and delivers them to destinations such as S three, with no consumer code to write. The program models the evening on a provisioned stream with two shards. At eighteen hundred, fifteen hundred clicks a second arrive, and the consumer, handling sixteen hundred, keeps up. From half past six, eighteen hundred a second arrive. The shards can accept that, but the consumer cannot process it, so a backlog builds: by half past seven, over a million records, about eleven minutes behind. When traffic drops at twenty hundred, it drains. Nothing is lost, because the backlog never approached the twenty four hour retention. But recommendations were eleven minutes stale at the busiest moment. The misconception is that data in the stream is data processed. Watch the iterator age. Size shards for what comes in, and consumers for what must go out.",
}
