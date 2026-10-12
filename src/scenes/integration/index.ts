import type { Scene } from '@graphlearning/flow'
import { apiContract } from './api-contract'
import { lambdaHandler } from './lambda-handler'
import { concurrencyLimits } from './concurrency-limits'
import { queueConsumer } from './queue-consumer'
import { snsFanout } from './sns-fanout'
import { eventRouting } from './event-routing'
import { orderWorkflow } from './order-workflow'
import { idempotency } from './idempotency'
import { integrationChoices } from './integration-choices'

// Chapter scenes, one per section, in section order.
export const integrationScenes: Scene[] = [
  apiContract,
  lambdaHandler,
  concurrencyLimits,
  queueConsumer,
  snsFanout,
  eventRouting,
  orderWorkflow,
  idempotency,
  integrationChoices,
]
