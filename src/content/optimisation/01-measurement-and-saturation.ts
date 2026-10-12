import type { Section } from '../types'

export const measurementAndSaturation: Section = {
  id: 'measurement-and-saturation',
  title: 'Workload measurement, bottlenecks, throughput, latency distributions, and saturation',
  scene: 'saturation-curve',
  focus: 'saturation-out',
  slide: `## Measuring before optimising

**Objective:** find the resource that limits the workload.

### Mental model
- **Throughput**: requests per second actually completed
- **Latency distribution**: p50 for most, p99 for the slowest
- **Saturation**: a resource with no spare capacity — work queues

### Worked example: one app server, 150 req/s
- 40% busy: p50 94 ms, p99 171 ms
- 93% busy: p99 299 ms; 98% busy: p99 873 ms
- The tail rises long before the server is full
- Each resource has its own saturation signal

### Misconception
- "Busy below 100% means headroom" — queues form well before

### Explanation summary
- Measure the tail per resource, then optimise the bottleneck`,
  narration:
    "This chapter uses measurements to improve the shop: its speed, its use of resources, and its cost. Optimising starts with finding what limits the workload, and three measures do that. Throughput is how many requests per second actually complete. Latency is a distribution, not a number: the fiftieth percentile describes most requests, the ninety ninth the slowest one in a hundred. And saturation means a resource has no spare capacity, so work waits in a queue. The program on the card is a model, not a measurement of A W S. It simulates one app server with fifteen workers, each taking about a hundred milliseconds, which is the shop's one hundred and fifty requests per second per server. At sixty requests a second the server is forty percent busy, the median is ninety four milliseconds and the ninety ninth percentile one hundred and seventy one. At one hundred and twenty, eighty percent busy, little changes. At one hundred and forty, ninety three percent busy, the ninety ninth percentile reaches two hundred and ninety nine. At one hundred and forty seven, ninety eight percent busy, it reaches eight hundred and seventy three milliseconds, while the median is only two hundred and six. The tail rises long before the server is full, because requests start queueing behind each other. The table lists where saturation shows first for each resource: C P U and a rising tail for an app server, pool waits for database connections, the Throttles metric for Lambda, the age of the oldest message for an S Q S consumer, and iterator age for a Kinesis consumer. The misconception is that anything under one hundred percent busy has headroom. So: measure the tail for each resource, then optimise the one that is the bottleneck.",
}
