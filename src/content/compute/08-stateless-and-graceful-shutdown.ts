import type { Section } from '../types'

export const statelessAndGracefulShutdown: Section = {
  id: 'stateless-and-graceful-shutdown',
  title: 'Stateless application design, graceful shutdown, and failure replacement',
  scene: 'stateless-design',
  focus: 'carts-out',
  slide: `## Stateless design and graceful shutdown

**Objective:** survive any server disappearing at any time.

### Mental model
- **Stateless**: no request depends on one server's memory or disk
- **Graceful shutdown**: on **SIGTERM**, stop taking work, finish, exit
- ECS: **SIGKILL** after 30 s (max 120); Spot warns ~2 min

### Worked example: two failures, run
- Carts on local disk: scale-in loses **99 of 300**
- Same carts in a shared store: **0 lost**
- A worker drains: finishes order-41, hands back 42 and 43

### Misconception
- "Replaced means recovered" — a new server does not restore lost carts

### Explanation summary
- Keep state outside; treat shutdown as a normal event`,
  narration:
    "Everything in this chapter assumes that servers come and go: scale in, failed health checks, Spot interruptions, deployments. That only works if no request depends on one particular server. The plan asks us to see what happens when that rule is broken, so the left program runs it. Three hundred shoppers are spread across three app servers, and each server keeps its shoppers' carts on its local disk. Then scale in terminates app two, a perfectly normal event. Ninety nine of three hundred carts are gone. The same carts kept in a shared store that every server can reach, like the cache or database of chapter six, lose nothing. The second program is the other half: shutting down well. When E C S or Auto Scaling stops a task or instance, the process first receives a SIGTERM signal. The worker handles it: it finishes the job in hand, order forty one, stops taking new work, and leaves orders forty two and forty three on the queue for another worker. Then it exits cleanly. If it ignores the signal, E C S waits for the stop timeout, thirty seconds by default and at most one hundred and twenty, then sends SIGKILL, and whatever was half done is lost. Spot gives a best effort two minute warning first. The misconception is that a replaced server means a recovered business. Auto Scaling restores capacity, but it does not bring back the ninety nine carts. Process recovery is not business correctness. So keep state outside the server, and treat shutdown as a normal event. Replaceable compute needs deliberate storage choices, so next we separate transient execution state from persistent data.",
}
