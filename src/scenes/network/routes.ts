import type { Scene } from '@graphlearning/flow'
import { BUILT_BY, mapFrame } from '../map'
import session from '../../../spine/network/03-routes/session.txt?raw'

// Every route table has a local route for the VPC's range; the most specific matching route wins
// (longest prefix match). A subnet is "public" because its route table sends 0.0.0.0/0 to an
// internet gateway — a resource in it still needs a public address to be reachable.
// source: https://docs.aws.amazon.com/vpc/latest/userguide/route-table-priority.html
// source: https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html
export const routes: Scene = mapFrame('route-selection', BUILT_BY[4], {
  id: 'routes-pane',
  label: 'side',
  bare: true,
  children: [
    { id: 'routes-run', kind: 'terminal', filename: 'Terminal — shop-on-aws · emulated', label: session.replace(/\n+$/, '') },
    {
      id: 'rt-public',
      kind: 'table',
      label: 'rt-public, for public-a, public-b, public-c',
      headers: ['destination', 'target', 'matches'],
      values: [
        ['10.20.0.0/16', 'local', 'anything inside the VPC'],
        ['0.0.0.0/0', 'igw-shop', 'everything else'],
      ],
    },
    {
      id: 'route-rules',
      kind: 'list',
      icon: 'router',
      label: 'How a route is picked',
      pattern: 'network',
      items: [
        'Every route that contains the destination is a candidate',
        'The longest prefix wins: /16 beats /0',
        'The local route is always there and cannot be removed',
        '“Public subnet” means its table reaches an internet gateway — not that every server in it is reachable',
      ],
    },
  ],
})
