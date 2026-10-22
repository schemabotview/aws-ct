import type { Scene } from '@graphlearning/flow'
import { BUILT_BY, mapFrame } from '../map'

// The end-to-end checkout as built in this course, and when each mechanism fits: a synchronous API
// when the caller needs the answer now; a queue for one consumer's work; a topic for fan-out to
// fixed subscribers; a bus for content-based routing; a workflow for multi-step state and
// compensation.
// source: https://docs.aws.amazon.com/decision-guides/latest/sns-or-sqs-or-eventbridge/sns-or-sqs-or-eventbridge.html
export const choices: Scene = mapFrame('integration-choices', BUILT_BY[10], {
  id: 'choices-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'checkout-flow',
      kind: 'table',
      label: 'One order, end to end',
      headers: ['step', 'mechanism', 'the shopper waits?'],
      values: [
        ['POST /orders, checked', 'API Gateway', 'yes'],
        ['take stock, record order', 'place-order, Lambda', 'yes, ~0.12 s'],
        ['reserve, charge, ship', 'Step Functions', 'no'],
        ['tell fulfilment, loyalty, fraud', 'SNS topic → queues', 'no'],
        ['VAT ledger, refunds', 'EventBridge rules', 'no'],
        ['ship it, once', 'SQS + idempotency key', 'no'],
      ],
    },
    {
      id: 'which-mechanism',
      kind: 'table',
      label: 'Which mechanism',
      headers: ['when', 'choose'],
      values: [
        ['the caller needs the answer now', 'a synchronous API'],
        ['one consumer, work that can wait', 'a queue'],
        ['several fixed consumers, each a copy', 'a topic'],
        ['route by what happened, many producers', 'a bus'],
        ['several steps, retries and undo', 'a workflow'],
      ],
    },
    {
      id: 'async-cost',
      kind: 'list',
      icon: 'swap',
      label: 'What asynchronous costs',
      pattern: 'warn',
      items: [
        'The shopper sees “placed”, not “shipped”: say so',
        'Every consumer must be safe to run twice',
        'A failure shows up later, in a DLQ, not as an error page',
      ],
    },
  ],
})
