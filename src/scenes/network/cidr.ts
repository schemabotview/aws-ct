import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { networkTree } from './tree'
import code from '../../../spine/network/01-cidr/project/tools/cidr_plan.py?raw'
import session from '../../../spine/network/01-cidr/session.txt?raw'

// AWS reserves the first four and the last address of every subnet (network, VPC router, DNS,
// future use, broadcast): a /24 has 251 usable. A VPC's IPv4 block is between /16 and /28.
// source: https://docs.aws.amazon.com/vpc/latest/userguide/subnet-sizing.html
// source: https://docs.aws.amazon.com/vpc/latest/userguide/vpc-cidr-blocks.html
export const cidr: Scene = ideFrame(
  'cidr-plan',
  'shop-on-aws',
  networkTree('01', 'tools/cidr_plan.py', ['tools/cidr_plan.py']),
  { file: 'tools/cidr_plan.py', code, highlight: [4, 7, 10, 12], terminal: session, emulated: false },
  {
    id: 'cidr-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'ports',
        kind: 'table',
        label: 'The ports the shop uses',
        headers: ['port', 'carries'],
        values: [
          ['443 TCP', 'HTTPS, the shoppers'],
          ['8080 TCP', 'the app, from the ALB'],
          ['5432 TCP', 'PostgreSQL, the orders'],
          ['53 UDP/TCP', 'DNS lookups'],
        ],
      },
      {
        id: 'cidr-rules',
        kind: 'list',
        icon: 'network',
        label: 'Reading a CIDR range',
        pattern: 'network',
        items: [
          '/16: the first 16 bits fixed, 65,536 addresses',
          '/24: 256 addresses, 251 usable in AWS',
          'AWS keeps five in every subnet',
          'Ranges that may ever connect must not overlap: dev is 10.30.0.0/16',
        ],
      },
    ],
  },
)
