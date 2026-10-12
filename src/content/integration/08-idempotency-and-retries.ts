import type { Section } from '../types'

export const idempotencyAndRetries: Section = {
  id: 'idempotency-and-retries',
  title: 'Idempotency, backoff, dead-letter handling, replay, and partial failures',
  scene: 'idempotency',
  focus: 'idem-out',
  slide: `## Idempotency, retries and dead letters

**Objective:** make every retry and redelivery harmless.

### Mental model
- **Idempotent**: doing it twice has the effect of doing it once
- Retry with **backoff and jitter**; give up into a **DLQ**
- Retry ownership depends on **how** Lambda was invoked

### Worked example: emulated with a key table
- Same fulfilment message twice → **one parcel**
- Order committed, reply lost, retried with key k-91 → **o-501 again**
- FIFO dedup would catch neither

### Misconception
- "Deduplication = idempotency" — dedup is the transport; the effect is yours

### Explanation summary
- Record the key with the effect; replay is then safe`,
  narration:
    "Everything in this chapter delivers at least once. Queues redeliver, Lambda retries, clients time out and try again. So the effect of handling something must be safe to repeat. That property is idempotency: doing it twice has the same effect as doing it once. The program shows the two duplicates the plan asks about, in an emulator. In both, the protection is a record keyed by an idempotency key, written with a condition that the key does not exist yet. First, a fulfilment message delivered twice. The first delivery claims ship o five oh one and ships a parcel. The second finds the key already there and does nothing, so one parcel is sent. Second, a timeout after a successful write. The shopper's app posts an order with idempotency key k ninety one. The order commits as five oh one, but the reply is lost. The app retries with the same key, and instead of creating order five oh two, the A P I returns five oh one again. Neither case would be caught by F I F O deduplication, which only suppresses repeated sends within five minutes. Retries also need backoff with jitter, so a crowd of clients does not retry in lockstep, and a limit, after which the message goes to a dead letter queue for inspection and later replay. Who retries depends on how Lambda was invoked, as the table shows: for synchronous calls, the caller; for asynchronous events, Lambda itself, twice more; for a queue, the message reappears until its receive count sends it to the dead letter queue. The misconception is that deduplication equals idempotency. Deduplication is the transport's feature; the business effect is yours. Record the key with the effect, and replay becomes safe.",
}
