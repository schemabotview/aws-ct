import type { Section } from '../types'

export const sqsQueues: Section = {
  id: 'sqs-queues',
  title: 'SQS queues: polling, visibility, acknowledgement, and standard/FIFO choices',
  scene: 'queue-consumer',
  focus: 'consumer-out',
  slide: `## SQS: polling, visibility, acknowledgement

**Objective:** follow a message until it is truly done.

### Mental model
- Consumers **poll**; a received message turns **invisible**
- **Delete** is the acknowledgement; no delete → it **reappears**
- Standard: at least once · FIFO: ordered per group

### Worked example: emulated, 1 s visibility
- Worker A receives o-501, then **crashes**
- Worker B sees nothing — then gets it, **receive #2**
- B deletes it: **0** waiting

### Misconception
- "FIFO means exactly once" — it dedupes sends for 5 minutes only

### Explanation summary
- Delete after success; expect redelivery`,
  narration:
    "A queue lets one part of the system hand work to another without waiting for it. The fulfilment service will read order events from an S Q S queue. Consumers poll the queue and receive messages. A received message is not removed; it becomes invisible for the visibility timeout, thirty seconds by default, up to twelve hours. If the consumer finishes, it deletes the message, and the delete is the acknowledgement. If it does not, the message becomes visible again and someone else receives it. The program plays this in an emulator, with a one second timeout so it runs quickly. Worker A receives order five oh one, receive number one, and crashes before deleting it. Worker B polls immediately and sees nothing, because the message is invisible. After the timeout, worker B receives the same message, receive number two, processes it and deletes it, and nothing is waiting. Notice what that means: the work was attempted twice. Set the visibility timeout longer than processing takes, or one slow worker will cause a second. Standard queues deliver at least once, with best effort ordering and very high throughput. F I F O queues keep order within a message group, such as one customer, and deduplicate repeated sends within a five minute window. The misconception is that F I F O means exactly once. It suppresses duplicate sends for five minutes; a consumer that crashes before deleting still causes a second delivery. So delete only after success, and design every consumer to expect redelivery.",
}
