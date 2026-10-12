import type { Scene } from '@graphlearning/flow'

// §7.7 — the order workflow as a Step Functions state machine (structure checked: StartAt, every
// Next/Catch target, Task resources, Retry fields). Throttled Lambda calls retry with backoff 1 s, 2 s,
// 4 s; a declined payment is caught and compensated by releasing the reserved stock. Standard
// workflows run up to a year; Express up to five minutes, at-least-once.
// source: https://docs.aws.amazon.com/step-functions/latest/dg/concepts-error-handling.html
// source: https://docs.aws.amazon.com/step-functions/latest/dg/choosing-workflow-type.html
export const orderWorkflow: Scene = {
  id: 'order-workflow',
  title: 'A workflow with a way back',
  cols: 2,
  padding: 0.05,
  nodes: [
    {
      id: 'diagram',
      label: 'Place order o-501',
      pattern: 'group',
      flow: 'TB',
      children: [
        { id: 'w-reserve', label: 'ReserveStock', sub: 'retry on throttle', pattern: 'service', icon: 'lambda' },
        { id: 'w-charge', label: 'ChargePayment', sub: 'catch PaymentDeclined', pattern: 'service', icon: 'lambda' },
        { id: 'w-ship', label: 'ShipOrder', sub: 'end', pattern: 'service', icon: 'lambda' },
        { id: 'w-release', label: 'ReleaseStock', sub: 'compensation', pattern: 'warn', icon: 'lambda' },
        { id: 'w-fail', label: 'OrderFailed', sub: 'Fail state', pattern: 'warn', icon: 'ban' },
      ],
      edges: [
        { source: 'w-reserve', target: 'w-charge' },
        { source: 'w-charge', target: 'w-ship', label: 'paid' },
        { source: 'w-charge', target: 'w-release', label: 'declined' },
        { source: 'w-release', target: 'w-fail' },
      ],
    },
    {
      id: 'asl',
      kind: 'code',
      filename: 'place-order.asl.json · model-checked',
      hug: true,
      label: `{
  "StartAt": "ReserveStock",
  "States": {
    "ReserveStock": {
      "Type": "Task",
      "Resource": "arn:aws:states:::lambda:invoke",
      "Parameters": { "FunctionName": "reserve-stock",
                      "Payload.$": "$" },
      "Retry": [{
        "ErrorEquals": ["Lambda.TooManyRequestsException"],
        "IntervalSeconds": 1, "BackoffRate": 2,
        "MaxAttempts": 3 }],
      "Next": "ChargePayment"
    },
    "ChargePayment": {
      "Type": "Task",
      "Resource": "arn:aws:states:::lambda:invoke",
      "Parameters": { "FunctionName": "charge-payment",
                      "Payload.$": "$" },
      "Catch": [{ "ErrorEquals": ["PaymentDeclined"],
                  "Next": "ReleaseStock" }],
      "Next": "ShipOrder"
    },
    "ShipOrder": {
      "Type": "Task",
      "Resource": "arn:aws:states:::lambda:invoke",
      "Parameters": { "FunctionName": "ship-order",
                      "Payload.$": "$" },
      "End": true
    },
    "ReleaseStock": {
      "Type": "Task",
      "Resource": "arn:aws:states:::lambda:invoke",
      "Parameters": { "FunctionName": "release-stock",
                      "Payload.$": "$" },
      "Next": "OrderFailed"
    },
    "OrderFailed": { "Type": "Fail", "Error": "PaymentDeclined" }
  }
}`,
    },
  ],
  edges: [],
}
