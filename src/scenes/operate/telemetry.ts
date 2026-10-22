import type { Scene } from '@graphlearning/flow'
import { BUILT_BY, mapFrame } from '../map'

// Metrics (CloudWatch: numbers over time, cheap, aggregated), logs (CloudWatch Logs: one event per
// line, searchable with Logs Insights), traces (X-Ray / OpenTelemetry: one request's path with
// per-segment timing). The evening's numbers are the shop's example (CLAUDE.md, telemetry), not a
// capture.
// source: https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/cloudwatch_concepts.html
// source: https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AnalyzingLogData.html
// source: https://docs.aws.amazon.com/xray/latest/devguide/xray-concepts.html
export const telemetry: Scene = mapFrame('telemetry-correlation', [...BUILT_BY[11], 'watch'], {
  id: 'telemetry-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'three-signals',
      kind: 'table',
      label: 'One slow evening, three signals',
      headers: ['signal', 'what it said at 18:06', 'what it cannot say'],
      values: [
        ['metric: latency', 'p50 112 → 114 ms, p99 132 → 1,020 ms', 'which requests, or why'],
        ['logs: order-api', '“pool exhausted, waited 900 ms”', 'how often, unless counted'],
        ['trace: 20 slow ones', '90% of the time waiting for a DB connection', 'the fleet-wide picture'],
      ],
    },
    {
      id: 'correlate',
      kind: 'table',
      label: 'Joining them up',
      headers: ['step', 'used'],
      values: [
        ['notice: the tail moved, the median did not', 'the p99 metric, an alarm'],
        ['narrow: which requests, which minute', 'trace ids in the slow log lines'],
        ['explain: where the time went', 'the trace’s segments'],
        ['confirm: how many, since when', 'a Logs Insights count by minute'],
      ],
    },
    {
      id: 'tail-lesson',
      kind: 'list',
      icon: 'cloudwatch',
      label: 'What the evening teaches',
      pattern: 'network',
      items: [
        'An average hides a tail: alarm on p99, not the mean',
        'Put a request id in every log line and every trace',
        'The cause was Course 9’s connection pool, again',
      ],
    },
  ],
})
