import type { Section } from '../types'

export const lambdaConcurrency: Section = {
  id: 'lambda-concurrency',
  title: 'Execution roles, configuration, concurrency controls, and downstream capacity',
  scene: 'concurrency-limits',
  focus: 'conc-out',
  slide: `## Roles, concurrency and downstream capacity

**Objective:** size a function so it cannot drown its database.

### Mental model
- **Concurrency** = requests per second × seconds per request
- **Reserved concurrency** caps a function (and guarantees it)
- The **execution role** grants only what the code calls

### Worked example: place-order at 560 req/s
- 0.12 s each → **67** concurrent needed
- Reserved **50** → 143 req/s throttled with 429
- At most **50** DB connections, of 190 free

### Misconception
- "Serverless scales without limits" — something downstream doesn't

### Explanation summary
- Cap concurrency to what dependencies can take`,
  narration:
    "Lambda scales by running more environments at once, and the number running at any moment is its concurrency. There is a simple law for it: concurrency equals the request rate times how long each request takes. The program applies it to place order, assuming each invocation takes about point one two seconds. At sixty requests a second, about seven environments are busy. At two hundred and forty, about twenty nine. At the five hundred and sixty request peak, sixty seven. Now remember chapter six. Each environment holds a database connection, and the database has only one hundred and ninety to spare. So we cap the function. Reserved concurrency fifty, the request beside the program, means place order can never run more than fifty at once, and it also guarantees those fifty out of the account's pool, which starts at one thousand per Region. At the peak, that cap throttles about one hundred and forty three requests a second with four twenty nine, which clients retry with backoff, and the database never sees more than fifty connections. Whether that trade is right is a business decision; the point is that it is now a decision rather than an outage. The execution role beside it is least privilege, checked against the I A M reference: put and get on the idempotency table, and put events on the default event bus. Nothing else. The misconception is that serverless scales without limits. The function might; the things it calls do not. So cap concurrency to what your dependencies can take.",
}
