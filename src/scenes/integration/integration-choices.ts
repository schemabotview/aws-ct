import type { Scene } from '@graphlearning/flow'

// §7.9 — the whole order flow, each hop chosen for a reason: synchronous API for what the shopper must
// see now; an event for "it happened"; queues to buffer work per consumer; a workflow where steps need
// order and compensation. The chapter's patterns, assembled.
// source: https://docs.aws.amazon.com/decision-guides/latest/decision-guides/sns-or-sqs-or-eventbridge.html
export const integrationChoices: Scene = {
  id: 'integration-choices',
  title: 'Each hop chosen for a reason',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'flow',
      label: 'An order, end to end',
      pattern: 'group',
      flow: 'TB',
      children: [
        { id: 'c-api', label: 'POST /orders', sub: 'sync: shopper waits', pattern: 'user', icon: 'apigateway' },
        { id: 'c-fn', label: 'place-order', sub: 'idempotent, DB tx', pattern: 'service', icon: 'lambda' },
        { id: 'c-bus', label: 'OrderPlaced event', sub: 'EventBridge', pattern: 'network', icon: 'eventbridge' },
        { id: 'c-wf', label: 'Payment workflow', sub: 'Step Functions', pattern: 'service', icon: 'stepfunctions' },
        { id: 'c-q', label: 'Fulfilment queue', sub: 'SQS, buffered', pattern: 'storage', icon: 'sqs' },
      ],
      edges: [
        { source: 'c-api', target: 'c-fn' },
        { source: 'c-fn', target: 'c-bus', label: 'after commit' },
        { source: 'c-bus', target: 'c-wf' },
        { source: 'c-bus', target: 'c-q' },
      ],
    },
    {
      id: 'choose',
      kind: 'table',
      label: 'Which mechanism, when?',
      sub: 'they combine; none replaces the others',
      headers: ['need', 'use'],
      values: [
        ['caller needs the answer now', 'synchronous API'],
        ['one consumer, smooth bursts', 'SQS queue'],
        ['many consumers, same message', 'SNS fan-out'],
        ['route by content, many sources', 'EventBridge'],
        ['ordered steps, compensation', 'Step Functions'],
      ],
    },
  ],
  edges: [],
}
