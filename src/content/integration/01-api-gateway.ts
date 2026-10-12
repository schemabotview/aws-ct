import type { Section } from '../types'

export const apiGateway: Section = {
  id: 'api-gateway',
  title: 'API Gateway, request contracts, authentication, validation, and throttling',
  scene: 'api-contract',
  focus: 'setup',
  slide: `## API Gateway: the front door

**Objective:** reject bad requests before code runs.

### Mental model
- A **contract**: a schema for what callers may send
- **Authoriser**: who is calling — a shopper's token
- **Throttling**: how fast — excess gets **429**
- **Timeout**: a REST integration stops at **29 s**

### Worked example: POST /orders
- Empty items → **400** from the validator
- No token → **401** from the Cognito authoriser
- Over 600 req/s on the stage → **429**

### Misconception
- "Validation is the handler's job" — the door can do it for free

### Explanation summary
- Contract, identity, rate: enforced at the edge`,
  narration:
    "Until now, shoppers reached the order A P I through a load balancer. For an A P I built from functions, A P I Gateway is the front door, and it can enforce three things before any of our code runs. First, the contract. The J S O N schema on the left says what a valid order looks like: an I D starting with o dash, and at least one item, each with a product and a quantity of at least one. The commands register it as a model and attach a request validator, so a malformed body is rejected at the door. Second, identity. A Cognito authoriser checks the shopper's token on every request. Third, rate. Stage throttling caps the A P I at six hundred requests a second, and A W S also applies account level defaults, ten thousand requests a second steady with a burst of five thousand, per Region. The card at the bottom shows what callers see. An order with an empty items list gets four hundred, invalid request body. A request without a token gets four oh one. The six hundred and first request in a second gets four twenty nine, too many requests, which tells a well behaved client to back off and retry. One more limit matters: a R E S T A P I integration times out after twenty nine seconds by default, so long work does not belong behind a synchronous call. The misconception is that validation is the handler's job. The handler should still be careful, but rejecting bad input at the edge costs nothing and protects everything behind it. Contract, identity and rate, enforced at the edge.",
}
