import type { Section } from '../types'

export const telemetryAndCorrelation: Section = {
  id: 'telemetry-and-correlation',
  title: 'Metrics, structured logs, traces, correlation, and telemetry retention',
  scene: 'telemetry-correlation',
  focus: 'traces-out',
  slide: `## Metrics, logs and traces

**Objective:** use each signal for the question it answers.

### Mental model
- **Metric**: a number per minute — *when* and *how much*
- **Structured log**: one JSON record per request — *what happened*
- **Trace**: spans across services — *where the time went*

### Worked example: checkout slows at 18:06
- p50 barely moves (112 → 114 ms); p99 jumps 132 → 1020 ms
- trace_id joins the slow log records to their spans
- 90% of slow-request time: waiting for a DB connection
- Logs and traces last only as long as retention is set

### Misconception
- "The average looks fine, so users are fine" — read the tail

### Explanation summary
- Metrics find the moment; correlated logs and traces find the cause`,
  narration:
    "This chapter is about running the shop once it is live: seeing what it does, noticing when it goes wrong, and recovering. It starts with the three kinds of telemetry. A metric is a number sampled over time, such as ninety ninth percentile latency per minute in CloudWatch; it tells you when something changed and by how much. A structured log is one J S O N record per request, with fields you can filter on, including a trace id. A trace, from X-Ray or OpenTelemetry, is the set of spans one request produced across services, so it shows where the time went. The program on the card models a real pattern. Four hundred requests, half at eighteen oh four and half at eighteen oh six. At eighteen oh six, one call in ten waits nine hundred milliseconds for a database connection. The output shows the median barely moving, from one hundred and twelve to one hundred and fourteen milliseconds, while the ninety ninth percentile jumps from one hundred and thirty two to one thousand and twenty. An average would have hidden this. Joining the slow log records to their traces by trace id finds twenty slow requests, and ninety percent of their time was spent waiting for a database connection: the connection pool from the databases chapter, exhausted. One assumption sits under all of this: logs and traces exist only for as long as their retention is configured, and only if the application emits the trace id in the first place. The misconception is that a healthy average means healthy users; the tail is where the slow ones are. So: metrics find the moment, and correlated logs and traces find the cause.",
}
