import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { runTree } from './tree'
import code from '../../../spine/run/09-stateless/project/app/server.py?raw'
import session from '../../../spine/run/09-stateless/session.txt?raw'

// Scale-in terminates instances, and their disks with them; ECS and Auto Scaling send SIGTERM and
// wait (deregistration delay, stopTimeout, lifecycle hooks) before stopping a target. carts.py is a
// model of round-robin traffic; the SIGTERM run is the real app.
// source: https://docs.aws.amazon.com/elasticloadbalancing/latest/application/edit-target-group-attributes.html#deregistration-delay
// source: https://docs.aws.amazon.com/autoscaling/ec2/userguide/lifecycle-hooks.html
export const stateless: Scene = ideFrame(
  'stateless-design',
  'shop-on-aws',
  runTree('09', 'app/server.py', ['tools/carts.py']),
  { file: 'app/server.py', code, show: [[36, 47]], highlight: [36, 38, 43, 46], terminal: session },
  {
    id: 'stateless-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'where-state',
        kind: 'table',
        label: 'Where state may live',
        headers: ['state', 'lives in'],
        values: [
          ['product data', 'S3'],
          ['carts', 'a shared store, Course 9'],
          ['orders', 'the database, Course 9'],
          ['the server’s disk', 'nothing that matters'],
        ],
      },
      {
        id: 'graceful',
        kind: 'list',
        icon: 'power',
        label: 'A clean scale-in',
        pattern: 'service',
        items: [
          'The ALB stops sending new requests first',
          'SIGTERM: finish what is in flight',
          'Then exit, before the timeout kills it',
          'Any server can go, so none may hold a cart',
        ],
      },
    ],
  },
)
