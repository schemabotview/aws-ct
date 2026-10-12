import type { Section } from '../types'

export const choosingIntegration: Section = {
  id: 'choosing-integration',
  title: 'Choosing synchronous APIs, queues, events, and orchestration together',
  scene: 'integration-choices',
  focus: 'flow',
  slide: `## Choosing the integration

**Objective:** justify each hop of the order flow.

### Mental model
- **Synchronous** when the caller needs the answer now
- **Queue** to buffer one consumer; **topic/bus** for many
- **Workflow** when steps need order and compensation

### Worked example: an order, end to end
- POST /orders → place-order: **sync**, idempotent, one DB transaction
- After commit: **OrderPlaced** on the bus
- Payment workflow and fulfilment queue consume it

### Misconception
- "Async everywhere is more scalable" — the shopper still needs an answer

### Explanation summary
- Sync for answers, async for work, workflows for processes`,
  narration:
    "The last section assembles the chapter. Each mechanism answers a different need, and a real system combines them. Follow an order through the board. The shopper posts the order and waits, because they need to know whether it was accepted, so that hop is synchronous: A P I Gateway to the place order function. That function does the minimum that must be true before answering: it checks the idempotency key, writes the order in one database transaction, and replies. Only after the commit does it put an order placed event on the event bus. Publishing before the commit would announce orders that might still roll back. From the bus, the work fans out. The payment and stock process is a Step Functions workflow, because its steps need an order and a way back. Fulfilment reads from its own queue, so a warehouse outage builds a backlog rather than losing orders. Other consumers, such as loyalty and VAT, attach their own rules or subscriptions without the orders team changing anything. The table is the summary: a synchronous A P I when the caller needs the answer now, a queue for one consumer and smooth bursts, a topic to fan out the same message, an event bus to route by content from many sources, and a workflow for ordered steps with compensation. The misconception is that making everything asynchronous is always more scalable. The shopper still needs an answer, and an asynchronous accept you cannot keep is worse than a clear error. Use synchronous calls for answers, asynchronous messages for work, and workflows for processes. Operational events also support analytical views; next we follow data into systems designed for broader queries.",
}
