import type { Scene } from '@graphlearning/flow'

// §7.1 — the order API's front door as an API Gateway REST API: a JSON-schema model and a request
// validator reject malformed bodies before any code runs; a Cognito authorizer checks the shopper's
// token; stage throttling sheds load with 429. Account defaults: 10,000 rps steady, 5,000 burst per
// Region; REST integrations time out at 29 s by default. The 400 body is illustrative.
// source: https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-method-request-validation.html
// source: https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-execution-service-limits-table.html
export const apiContract: Scene = {
  id: 'api-contract',
  title: 'The API’s contract is enforced at the door',
  cols: 2,
  padding: 0.05,
  nodes: [
    {
      id: 'schema',
      kind: 'code',
      filename: 'order-schema.json · illustrative',
      hug: true,
      label: `{
  "type": "object",
  "required": ["id", "items"],
  "properties": {
    "id": { "type": "string", "pattern": "^o-[0-9]+$" },
    "items": {
      "type": "array", "minItems": 1,
      "items": {
        "type": "object",
        "required": ["product", "qty"],
        "properties": {
          "product": { "type": "string" },
          "qty": { "type": "integer", "minimum": 1 }
        }
      }
    }
  }
}`,
    },
    {
      id: 'setup',
      kind: 'code',
      filename: 'api-gateway.sh · model-checked',
      hug: true,
      label: `aws apigateway create-model --rest-api-id "$API" \\
  --name Order --content-type application/json \\
  --schema file://order-schema.json
aws apigateway create-request-validator \\
  --rest-api-id "$API" --name body-only \\
  --validate-request-body
aws apigateway create-authorizer --rest-api-id "$API" \\
  --name shoppers --type COGNITO_USER_POOLS \\
  --provider-arns "$USER_POOL_ARN" \\
  --identity-source method.request.header.Authorization
aws apigateway update-stage --rest-api-id "$API" \\
  --stage-name prod --patch-operations \\
  op=replace,path=/*/*/throttling/rateLimit,value=600`,
    },
    {
      id: 'rejected',
      kind: 'code',
      filename: 'rejected.txt · illustrative',
      hug: true,
      label: `POST /orders  {"id": "o-501", "items": []}
HTTP/1.1 400 Bad Request
{"message": "Invalid request body"}

POST /orders  (no Authorization header)
HTTP/1.1 401 Unauthorized

POST /orders  (the 601st request this second)
HTTP/1.1 429 Too Many Requests`,
    },
    {
      id: 'layers',
      kind: 'list',
      framed: true,
      label: 'Checked before your code runs',
      icon: 'apigateway',
      pattern: 'network',
      items: [
        'who: a valid shopper token',
        'what: a body that fits the schema',
        'how much: within the stage throttle',
        'how long: integration timeout 29 s',
      ],
    },
  ],
  edges: [],
}
