import type { Scene } from '@graphlearning/flow'
import { BUILT_BY, mapFrame } from '../map'
import session from '../../../spine/network/04-egress/session.txt?raw'

// A NAT gateway lets instances in private subnets start connections out; nothing outside can start
// one in. A NAT gateway lives in one AZ; AWS recommends one per AZ so an AZ failure does not cut
// the others off. Hypothetical rate (CLAUDE.md): $0.05/h + $0.05/GB → three = $109.50 a month.
// source: https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html
// source: https://docs.aws.amazon.com/vpc/latest/userguide/nat-gateway-basics.html
export const egress: Scene = mapFrame('private-egress', BUILT_BY[4], {
  id: 'egress-pane',
  label: 'side',
  bare: true,
  children: [
    { id: 'egress-run', kind: 'terminal', filename: 'Terminal — shop-on-aws · emulated', label: session.replace(/\n+$/, '') },
    {
      id: 'who-starts',
      kind: 'table',
      label: 'Who can start a connection',
      headers: ['from', 'to', 'through', 'allowed'],
      values: [
        ['the internet', 'the ALB, public-a', 'internet gateway', 'yes'],
        ['the internet', 'a server, app-a', '—', 'no route in'],
        ['a server, app-a', 'api.payments.example.com', 'nat-a, then igw', 'yes'],
        ['the payments API', 'a server, app-a', '—', 'no: NAT is one-way'],
      ],
    },
    {
      id: 'nat-cost',
      kind: 'list',
      icon: 'receipt',
      label: 'One NAT gateway, or three',
      pattern: 'external',
      items: [
        'A NAT gateway lives in one AZ: lose eu-west-2a, and app-b and app-c lose the internet too',
        'Production runs one per AZ: 3 × 730 h × $0.05 = $109.50 a month, hypothetical, before data',
        'Course 13 finds it is the shop’s largest single line',
      ],
    },
  ],
})
