import type { Section } from '../types'

export const stepFunctions: Section = {
  id: 'step-functions',
  title: 'Step Functions: workflow state, branching, retries, and compensation',
  scene: 'order-workflow',
  focus: 'asl',
  slide: `## Step Functions: workflows

**Objective:** run multi-step work with retries and a way back.

### Mental model
- A **state machine** holds the workflow's state between steps
- **Retry**: try again with backoff · **Catch**: go elsewhere
- **Compensation** undoes earlier steps when a later one fails

### Worked example: place order o-501
- ReserveStock retries throttles: **1 s, 2 s, 4 s**
- PaymentDeclined → **ReleaseStock** → OrderFailed
- Standard: up to a year · Express: 5 min, at least once

### Misconception
- "Retries make it reliable" — a failed step needs an undo

### Explanation summary
- Retry the transient; compensate the permanent`,
  narration:
    "Some business processes are several steps that must happen in order: reserve the stock, charge the payment, ship the order. Chaining functions that call each other hides that process in code. Step Functions makes it explicit as a state machine, which keeps the workflow's state between steps and records every execution. The diagram and the definition on the right are the same workflow, and the definition's structure was checked: every next and catch target exists, and every task has a resource. Reserve stock calls a function and retries if Lambda is throttled, waiting one second, then two, then four, because the backoff rate doubles the interval, up to three attempts. Then charge payment. If the payment provider declines, that is not a transient error worth retrying. The catch sends the workflow to release stock, which undoes the reservation, and then to a fail state that records why. That undo step is compensation: there is no transaction across the stock service and the payment provider, so we design the reverse action ourselves. Step Functions has two workflow types. Standard workflows can run for up to a year and execute each step once. Express workflows run for up to five minutes, at much higher rates, and can run steps more than once, so their steps must be idempotent. The misconception is that retries make a process reliable. Retries handle transient failures; a permanent failure halfway through needs an undo. So retry the transient, and compensate the permanent.",
}
