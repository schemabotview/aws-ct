import type { Section } from '../types'

export const snsFanout: Section = {
  id: 'sns-fanout',
  title: 'SNS topics, subscriptions, filtering, and fan-out delivery',
  scene: 'sns-fanout',
  focus: 'fanout-out',
  slide: `## SNS: topics and fan-out

**Objective:** deliver one event to every interested consumer.

### Mental model
- Publish once to a **topic**; each **subscription** gets a copy
- A **filter policy** narrows what a subscriber receives
- Topic → queues: each consumer gets its own buffer

### Worked example: emulated
- o-501 (29), o-502 (640), o-503 (75)
- fulfilment, loyalty: **all three**
- fraud-check, total ≥ 500: **o-502** only
- Filtering happens in SNS; fraud never sees the rest

### Misconception
- "One queue, many readers" — a queue gives each message to one

### Explanation summary
- Fan out with a topic; buffer each consumer with a queue`,
  narration:
    "A queue gives each message to one consumer. Often several services care about the same event: fulfilment must ship the order, loyalty must award points, and fraud checking wants to look at large orders. That is fan out, and S N S does it. You publish once to a topic. Every subscription receives its own copy. A subscription can carry a filter policy, so it receives only the messages it cares about. The common pattern, shown on the board, is a topic in front of queues: each consuming service gets its own S Q S queue, so a slow or broken consumer builds up its own backlog without slowing the others. The program builds exactly that in an emulator. The order events topic has three queue subscriptions. Fulfilment and loyalty take everything. Fraud check has a filter policy on the message attribute total: numeric, greater than or equal to five hundred. Three orders are published, totals twenty nine, six hundred and forty, and seventy five. Fulfilment and loyalty each receive all three. Fraud check receives only order five oh two. Filtering happens in S N S, so the fraud service never pays to receive and discard the others. The misconception is that several services can simply read the same queue. They would compete: each message would go to one of them. So fan out with a topic, and buffer each consumer with its own queue.",
}
