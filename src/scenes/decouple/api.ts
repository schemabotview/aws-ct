import type { Scene } from '@graphlearning/flow'
import { BUILT_BY, mapFrame } from '../map'
import code from '../../../spine/decouple/01-api/project/infra/10-api.sh?raw'
import session from '../../../spine/decouple/01-api/session.txt?raw'

// API Gateway REST APIs: a request validator checks the body against a model (JSON Schema draft 4)
// and returns 400 before any integration runs; a Cognito user-pool authorizer rejects a missing or
// invalid token with 401; stage/method throttling returns 429 above the rate (token bucket, burst).
// source: https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-method-request-validation.html
// source: https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-integrate-with-cognito.html
// source: https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html
export const api: Scene = mapFrame('api-contract', [...BUILT_BY[9], 'api'], {
  id: 'api-pane',
  label: 'side',
  bare: true,
  children: [
    { id: 'api-sh', kind: 'code', filename: 'infra/10-api.sh', label: code.replace(/\n+$/, ''), show: [[16, 25]], highlight: [17, 19, 23, 24, 25] },
    { id: 'api-run', kind: 'terminal', filename: 'Terminal — shop-on-aws · emulated', label: session.replace(/\n+$/, '') },
    {
      id: 'rejected',
      kind: 'table',
      label: 'Turned away before any code runs',
      headers: ['request', 'answer', 'checked by'],
      values: [
        ['no or bad shopper token', '401', 'the shoppers authorizer'],
        ['body missing lines, or qty 0', '400', 'body-only against Order'],
        ['above 600 a second, burst 1,200', '429', 'stage prod throttling'],
        ['all three pass', 'the integration', 'a mock, until §2'],
      ],
    },
  ],
})
