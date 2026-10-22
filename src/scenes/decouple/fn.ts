import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { decoupleTree } from './tree'
import code from '../../../spine/decouple/02-function/project/functions/place_order/handler.py?raw'
import session from '../../../spine/decouple/02-function/session.txt?raw'

// Lambda runs the handler in an execution environment; code outside the handler runs once at
// initialisation (a cold start) and the environment is reused for later invocations; the timeout
// (here 10 s, max 900 s) ends an invocation. moto does not run Lambda code without Docker, so
// tools/invoke_local.py imports and calls the handler the way the runtime does, against the
// emulator's DynamoDB.
// source: https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html
// source: https://docs.aws.amazon.com/lambda/latest/dg/python-handler.html
// source: https://docs.aws.amazon.com/lambda/latest/dg/configuration-timeout.html
export const fn: Scene = ideFrame(
  'lambda-handler',
  'shop-on-aws',
  decoupleTree('02', 'functions/place_order/handler.py', ['functions', 'infra/10-function.sh', 'policies/place-order-trust.json', 'tools/invoke_local.py']),
  { file: 'functions/place_order/handler.py', code, show: [[7, 10], [13, 19], [28, 31]], highlight: [8, 9, 10, 13, 15, 19], terminal: session },
  {
    id: 'fn-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'fn-config',
        kind: 'table',
        label: 'place-order',
        headers: ['setting', 'value'],
        values: [
          ['runtime', 'python3.13, arm64'],
          ['memory', '512 MB, CPU in step'],
          ['timeout', '10 s, then stopped'],
          ['environment', 'table names, no secrets'],
          ['role', 'PlaceOrderFn, §3'],
        ],
      },
      {
        id: 'fn-life',
        kind: 'list',
        icon: 'lambda',
        label: 'One environment, many calls',
        pattern: 'service',
        items: [
          'Init once: imports, client, names',
          'Then the handler, call after call',
          'Globals survive; never trust them',
          'The emulator cannot run Lambda',
        ],
      },
    ],
  },
)
