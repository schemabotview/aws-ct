import type { Section } from '../types'

export const lambdaExecution: Section = {
  id: 'lambda-execution',
  title: 'Lambda handlers, execution environments, initialisation, reuse, and timeouts',
  scene: 'lambda-handler',
  focus: 'handler-out',
  slide: `## Lambda handlers and environments

**Objective:** say what runs once, what runs per event, and what lasts.

### Mental model
- **INIT**: module code, once per execution environment
- **Handler**: once per event, one event at a time
- A warm environment **may** be reused — or not

### Worked example: place-order, run locally
- Returns **201** with total **29.0**
- Warm calls see calls_in_this_env = **1, 2**
- New environment: back to **1** — not durable state

### Misconception
- "A global variable remembers" — only until the environment goes

### Explanation summary
- Cache in INIT; keep state in a database`,
  narration:
    "A Lambda function is code that A W S runs when an event arrives, inside an execution environment it creates and manages. Two parts of the code run at different times. Everything at module level, outside the handler, is the INIT phase. It runs once, when a new environment starts. Here it loads the product prices and sets a counter. The handler runs once per event, and an environment handles one event at a time. After an event, Lambda may keep the environment warm and reuse it for the next one, skipping INIT. The program runs the handler locally with a test event, exactly as the A P I would send it. It returns status two oh one with the order and a total of twenty nine, the same total as chapter six. Watch the counter. In a warm environment the first call sees one and the second sees two, because module state survived. Then we simulate a new environment, and the count is back to one. Real traffic spreads across many environments, created and discarded as A W S sees fit, so that counter is meaningless as a business number. The request on the right creates the function: Python three point one three on arm sixty four, five hundred and twelve megabytes, its own execution role, and a timeout of ten seconds set explicitly. If a call exceeds it, the invocation is stopped. Our examples assume a standard on demand function. The misconception is that a global variable remembers things. It remembers only until that environment goes away. So cache expensive setup in INIT, and keep state that matters in a database.",
}
