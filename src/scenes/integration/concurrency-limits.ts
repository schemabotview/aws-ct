import type { Scene } from '@graphlearning/flow'

// §7.3 — concurrency = rate × duration. At the 560 req/s peak with an assumed 0.12 s per invocation,
// place-order needs ~67 concurrent environments; reserved concurrency 50 caps it (throttling the rest
// with 429) to protect the database's 190 free connections (Ch. 6). Accounts start at 1,000
// concurrent executions per Region (new accounts can be lower). The PlaceOrderFn execution role is
// least privilege (parliament-checked).
// source: https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html
// source: https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html
export const concurrencyLimits: Scene = {
  id: 'concurrency-limits',
  title: 'Concurrency is rate times duration',
  flow: 'TB',
  padding: 0.05,
  nodes: [
    {
      id: 'conc',
      kind: 'code',
      filename: 'concurrency.py · runs locally',
      hug: true,
      label: `DURATION = 0.12  # seconds per invocation (assumed p50)
RESERVED = 50    # reserved concurrency for place-order
DB_FREE = 190    # free PostgreSQL connections (Ch. 6)

for rate in (60, 240, 560):
    needed = rate * DURATION  # Little's law: L = rate x time
    served = min(rate, RESERVED / DURATION)
    throttled = rate - served
    note = f"{throttled:.0f}/s throttled (429)" if throttled else "all served"
    print(f"{rate:>3} req/s -> {needed:>4.1f} concurrent, {note}")
print(f"worst case {RESERVED} DB connections of {DB_FREE} free")`,
    },
    {
      id: 'conc-out',
      kind: 'code',
      filename: 'output',
      hug: true,
      label: ` 60 req/s ->  7.2 concurrent, all served
240 req/s -> 28.8 concurrent, all served
560 req/s -> 67.2 concurrent, 143/s throttled (429)
worst case 50 DB connections of 190 free`,
    },
    {
      id: 'controls',
      label: 'Configuration that bounds it',
      pattern: 'group',
      cols: 2,
      children: [
        {
          id: 'reserve',
          kind: 'code',
          filename: 'lambda.PutFunctionConcurrency.request.json · model-checked',
          hug: true,
          label: `{
  "FunctionName": "place-order",
  "ReservedConcurrentExecutions": 50
}`,
        },
        {
          id: 'role',
          kind: 'code',
          filename: 'place-order-role.json · model-checked',
          hug: true,
          label: `{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["dynamodb:PutItem", "dynamodb:GetItem"],
    "Resource":
      "arn:aws:dynamodb:eu-west-2:111122223333:table/idempotency"
  }, {
    "Effect": "Allow",
    "Action": "events:PutEvents",
    "Resource":
      "arn:aws:events:eu-west-2:111122223333:event-bus/default"
  }]
}`,
        },
      ],
    },
  ],
  edges: [],
}
