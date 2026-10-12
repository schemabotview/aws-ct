import type { Scene } from '@graphlearning/flow'

// §7.2 — the place-order handler and its API response, run locally with a test event: code at module
// level is INIT (once per execution environment); the handler runs per event; a warm environment
// keeps module state, a new one starts again, so it is never durable state. The CreateFunction
// request (validated in full) sets the timeout explicitly. Scope: a standard on-demand function.
// source: https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html
export const lambdaHandler: Scene = {
  id: 'lambda-handler',
  title: 'A handler, and the environment around it',
  cols: 2,
  padding: 0.05,
  nodes: [
    {
      id: 'run',
      label: 'handler.py with a test event',
      pattern: 'group',
      cols: 1,
      children: [
        {
          id: 'handler',
          kind: 'code',
          filename: 'handler.py · runs locally',
          hug: true,
          label: `import json

# INIT: runs once per execution environment, before any event
PRICES = {"p-1001": 10.00, "p-1002": 4.50}  # e.g. read from S3
calls = 0  # lives only as long as THIS environment


def handler(event, context):
    global calls
    calls += 1
    order = json.loads(event["body"])
    total = sum(PRICES[i["product"]] * i["qty"]
                for i in order["items"])
    return {
        "statusCode": 201,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({"order": order["id"], "total": total,
                            "calls_in_this_env": calls}),
    }


# local test: two warm calls, then a fresh environment
event = {"body": json.dumps({"id": "o-501", "items": [
    {"product": "p-1001", "qty": 2},
    {"product": "p-1002", "qty": 2}]})}
print(handler(event, None)["body"])
print(handler(event, None)["body"])
calls = 0  # a NEW environment runs INIT again
response = handler(event, None)
print(response["statusCode"], response["body"])`,
        },
        {
          id: 'handler-out',
          kind: 'code',
          filename: 'output',
          hug: true,
          label: `{"order": "o-501", "total": 29.0, "calls_in_this_env": 1}
{"order": "o-501", "total": 29.0, "calls_in_this_env": 2}
201 {"order": "o-501", "total": 29.0, "calls_in_this_env": 1}`,
        },
      ],
    },
    {
      id: 'create',
      kind: 'code',
      filename: 'lambda.CreateFunction.request.json · model-checked',
      hug: true,
      label: `{
  "FunctionName": "place-order",
  "Runtime": "python3.13",
  "Architectures": ["arm64"],
  "Handler": "handler.handler",
  "Role": "arn:aws:iam::111122223333:role/PlaceOrderFn",
  "Code": {
    "S3Bucket": "shop-releases-111122223333",
    "S3Key": "place-order-1.4.2.zip"
  },
  "MemorySize": 512,
  "Timeout": 10,
  "Environment": {
    "Variables": { "TABLE": "idempotency" }
  }
}`,
    },
  ],
  edges: [],
}
