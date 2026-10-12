import type { Section } from '../types'

export const declarativeInfrastructure: Section = {
  id: 'declarative-infrastructure',
  title: 'Declarative infrastructure, resource ownership, dependencies, and repeatability',
  scene: 'declarative-vs-imperative',
  focus: 'compare',
  slide: `## Declarative infrastructure

**Objective:** describe infrastructure as a state, owned by a stack.

### Mental model
- **Imperative**: commands to run, in order
- **Declarative**: the end state; the engine finds the steps
- A **stack** owns what its template declares

### Worked example: a queue and its DLQ
- Script: run twice → errors or silent differences
- Template: run twice → **no change**
- Delete or copy: the **whole stack**, any account
- Templates are reviewed like code, in pull requests

### Misconception
- "Scripts are infrastructure as code" — they record actions, not state

### Explanation summary
- Declare the end state; let one stack own it`,
  narration:
    "Every resource in this course so far could be created by hand or with a script of commands. That works once. The second time, in another account or after someone changed something, it starts to fail. Compare the two cards. On the left, a script: create the dead letter queue, look up its A R N, create the main queue pointing at it. It is a list of actions to perform, in order. Run it twice and the second create either fails or produces something subtly different, and nothing records which resources belong to this system. On the right, the same two queues as a CloudFormation template. It does not say what to do; it says what should exist: a dead letter queue, and a queue whose redrive policy points at it. CloudFormation works out the steps, and a stack, the deployed instance of the template, owns everything it declares. The table shows what that buys. Running it again changes nothing if nothing changed. Ownership is recorded. Deleting the stack deletes its resources together. And the same template builds the same system in the development account and in production. The list adds the principles: describe the end state, let the engine derive the order from references, give every resource exactly one owning stack, and review templates like code, in pull requests. The misconception is that any script is infrastructure as code. A script records actions; a template records the intended state. Declare the end state, and let one stack own it.",
}
