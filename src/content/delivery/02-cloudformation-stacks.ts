import type { Section } from '../types'

export const cloudformationStacks: Section = {
  id: 'cloudformation-stacks',
  title: 'CloudFormation templates, stacks, resource references, and dependency ordering',
  scene: 'stack-template',
  focus: 'waves-out',
  slide: `## Templates, stacks and dependencies

**Objective:** read a template and predict its creation order.

### Mental model
- **Resources**: logical names → AWS types and properties
- **!Ref / !GetAtt** link resources — and imply dependencies
- Independent resources are created **in parallel**

### Worked example: order-events plumbing
- Wave 1: **topic** and **DLQ**
- Wave 2: **queue** (needs the DLQ's ARN)
- Wave 3: **policy** and **subscription**; delete in reverse

### Misconception
- "Resources are created top to bottom" — references decide

### Explanation summary
- References are the dependency graph`,
  narration:
    "Let's read a real template, the order events plumbing from chapter seven, linted with cfn lint. Each entry under resources has a logical name, such as order events queue, a type, such as A W S S Q S Queue, and properties. The interesting part is how resources refer to each other. Ref returns a resource's main identifier; for a queue, its U R L, for a topic, its A R N. Get att returns a named attribute, such as the dead letter queue's A R N. Every reference is also a dependency: CloudFormation cannot create the main queue until the dead letter queue exists, because it needs that A R N for the redrive policy. The queue policy allows only the S N S service to send messages, and only when the source is our topic, the same scoping we discussed for services in chapter two. The program on the right takes those references and computes the creation order with a topological sort, which is what CloudFormation does internally. Wave one creates the topic and the dead letter queue at the same time, because neither depends on anything. Wave two creates the queue. Wave three creates the queue policy and the subscription, which need both. Deletion runs the same waves in reverse. When a dependency exists that no reference expresses, depends on makes it explicit. The misconception is that resources are created from the top of the file to the bottom. Order in the file means nothing; the references are the dependency graph.",
}
