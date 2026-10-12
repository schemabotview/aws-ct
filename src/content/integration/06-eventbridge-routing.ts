import type { Section } from '../types'

export const eventbridgeRouting: Section = {
  id: 'eventbridge-routing',
  title: 'EventBridge buses, rules, schemas, and event routing',
  scene: 'event-routing',
  focus: 'routing-out',
  slide: `## EventBridge: route by content

**Objective:** send each event to exactly the targets that want it.

### Mental model
- Producers put events on a **bus**
- A **rule** matches event content and invokes **targets**
- The event's shape is a **schema** — a contract
- No rule matches → the event goes **nowhere**

### Worked example: emulated
- uk-vat: OrderPlaced **and** country GB → **o-501**
- refunds: OrderRefunded → **o-502**
- o-504 (FR) matches no rule — nothing receives it

### Misconception
- "Events are fire and forget" — consumers depend on their shape

### Explanation summary
- Rules route on content; version the schema`,
  narration:
    "S N S filters on message attributes chosen by the publisher. EventBridge goes further: it routes on the content of the event itself, from many sources, through rules. Producers put events onto a bus. Each event has a source, a detail type, and a detail object with the facts. A rule is a pattern; when an event matches, EventBridge invokes the rule's targets, such as a queue, a function or a workflow. The program defines two rules in an emulator. U K VAT matches order placed events from the shop's orders source whose country is G B. Refunds matches order refunded events from any country. Three events are put on the bus. Order five oh one, placed in G B, reaches the U K VAT queue. Order five oh two's refund reaches the refunds queue. Order five oh four, placed in France, matches no rule, and nothing receives it. That is correct behaviour, but it is easy to miss: an event no rule matches is simply not delivered anywhere. The structure of detail is now a contract. The VAT service depends on a field called country, spelled that way. If the orders team renames it, routing silently stops. EventBridge can record schemas so producers and consumers agree on that shape. The misconception is that events are fire and forget. The producer forgets; the consumers depend on every field. So route on content with rules, and version the schema like any other A P I.",
}
