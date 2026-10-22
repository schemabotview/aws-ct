import type { Course } from '../types'
import { anApiInFront } from './01-an-api-in-front'
import { aFunctionToPlaceTheOrder } from './02-a-function-to-place-the-order'
import { concurrencyAndWhatIsBehindIt } from './03-concurrency-and-what-is-behind-it'
import { aQueueForFulfilment } from './04-a-queue-for-fulfilment'
import { fanOut } from './05-fan-out'
import { eventRouting } from './06-event-routing'
import { theOrderWorkflow } from './07-the-order-workflow'
import { doingItOnce } from './08-doing-it-once'
import { choosingTheMechanism } from './09-choosing-the-mechanism'

// Course 10 — Decouple the checkout. API Gateway in front; the place-order function, its role and
// reserved concurrency; an SQS worker; SNS fan-out with a filter; EventBridge rules; a Step
// Functions workflow with retry and compensation; idempotency and dead letters; choosing between them.
export const decouple: Course = {
  id: 'decouple',
  title: 'Decouple the checkout',
  sections: [anApiInFront, aFunctionToPlaceTheOrder, concurrencyAndWhatIsBehindIt, aQueueForFulfilment, fanOut, eventRouting, theOrderWorkflow, doingItOnce, choosingTheMechanism],
}
