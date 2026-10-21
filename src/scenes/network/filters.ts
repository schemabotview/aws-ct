import type { Scene } from '@graphlearning/flow'
import { BUILT_BY, mapFrame } from '../map'
import session from '../../../spine/network/05-filters/session.txt?raw'

// Security groups are stateful, attach to network interfaces, and only allow; a rule may name
// another security group as its source. Network ACLs are stateless, attach to subnets, have
// numbered allow and deny rules, and need return traffic allowed explicitly.
// source: https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html
// source: https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html
export const filters: Scene = mapFrame('traffic-filters', BUILT_BY[4], {
  id: 'filters-pane',
  label: 'side',
  bare: true,
  children: [
    { id: 'filters-run', kind: 'terminal', filename: 'Terminal — shop-on-aws · emulated', label: session.replace(/\n+$/, '') },
    {
      id: 'chain',
      kind: 'table',
      label: 'The chain: each tier admits only the one before it',
      headers: ['group', 'allows in', 'from'],
      values: [
        ['sg-alb', 'TCP 443', '0.0.0.0/0, anyone'],
        ['sg-app', 'TCP 8080', 'members of sg-alb'],
        ['sg-db', 'TCP 5432', 'members of sg-app'],
      ],
    },
    {
      id: 'sg-nacl',
      kind: 'table',
      label: 'Security group or network ACL',
      headers: ['', 'security group', 'network ACL'],
      values: [
        ['attached to', 'a network interface', 'a subnet'],
        ['rules', 'allow only', 'allow and deny, numbered'],
        ['state', 'stateful: replies return', 'stateless: allow both ways'],
        ['source', 'a CIDR or another group', 'a CIDR only'],
      ],
    },
  ],
})
