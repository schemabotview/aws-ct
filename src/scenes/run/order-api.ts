import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { runTree } from './tree'
import code from '../../../spine/run/01-order-api/project/app/server.py?raw'
import session from '../../../spine/run/01-order-api/session.txt?raw'

// The app, run on the laptop: Python's standard-library HTTP server, reading products from the
// catalog bucket through boto3 — the bucket is the emulator's, the server and curl are real.
export const orderApi: Scene = ideFrame(
  'order-api',
  'shop-on-aws',
  runTree('01', 'app/server.py', ['app/server.py']),
  { file: 'app/server.py', code, show: [[8, 23]], highlight: [14, 15, 17, 19, 21], terminal: session },
  {
    id: 'order-api-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'routes',
        kind: 'table',
        label: 'What the app answers',
        headers: ['request', 'answer'],
        values: [
          ['GET /health', '200, for the ALB'],
          ['GET /products/p-1001', '200, the product'],
          ['GET /products/p-9999', '404'],
          ['anything else', '404'],
        ],
      },
      {
        id: 'app-facts',
        kind: 'list',
        icon: 'python',
        label: 'Version one of the order API',
        pattern: 'service',
        items: [
          'Products come from S3, so any server can answer',
          'No key in the code: boto3 finds the credentials',
          'Port 8080, the one sg-app admits from the ALB',
          'Orders arrive in Course 9; carts in §9',
        ],
      },
    ],
  },
)
