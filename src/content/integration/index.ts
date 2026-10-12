import type { Course } from '../types'
import { apiGateway } from './01-api-gateway'
import { lambdaExecution } from './02-lambda-execution'
import { lambdaConcurrency } from './03-lambda-concurrency'
import { sqsQueues } from './04-sqs-queues'
import { snsFanout } from './05-sns-fanout'
import { eventbridgeRouting } from './06-eventbridge-routing'
import { stepFunctions } from './07-step-functions'
import { idempotencyAndRetries } from './08-idempotency-and-retries'
import { choosingIntegration } from './09-choosing-integration'

// Chapter 7 of AWS-COURSE-PLAN.md — 9 of 9 sections, one scene each.
//
// Objective: Explain synchronous and asynchronous workflows, including retries, concurrency, and
// duplicate effects.
//
// Worked illustrations (from the plan): an annotated Python handler and API response (§2, run); a
// queue-consumer sequence (§4, moto); a duplicate fulfilment message and a timeout after a successful
// database write (§8, moto); an order-workflow diagram (§7 diagram + checked ASL, §9 end to end).
// Lambda synchronous / asynchronous / event-source-mapping retry ownership: §8's table. Execution examples
// are standard on-demand functions; environment reuse is shown not to be durable state (§2). Message
// deduplication is separated from business-effect idempotency, including FIFO (§4, §8).
//
// Outcome: Explain an API/event workflow, interpret retry and acknowledgement paths, and justify where
// idempotency, backpressure, and recovery handling belong.
//
// Bridge: Operational events also support analytical views; next we follow data into systems designed
// for broader queries. (Spoken as the last line of §9's narration.)
export const integration: Course = {
  id: 'integration',
  title: 'APIs, Serverless Execution, and Asynchronous Work',
  sections: [
    apiGateway,
    lambdaExecution,
    lambdaConcurrency,
    sqsQueues,
    snsFanout,
    eventbridgeRouting,
    stepFunctions,
    idempotencyAndRetries,
    choosingIntegration,
  ],
}
