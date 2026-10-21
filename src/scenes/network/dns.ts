import type { Scene } from '@graphlearning/flow'
import { BUILT_BY, mapFrame } from '../map'
import code from '../../../spine/network/06-dns/project/infra/dns/shop-alias.json?raw'
import session from '../../../spine/network/06-dns/session.txt?raw'

// An alias record points a name at an AWS resource (here an ALB) and is answered by Route 53 with
// the resource's current addresses; ZHURV8PSTC4K8 is the canonical hosted zone of Application Load
// Balancers in eu-west-2. Routing policies: simple, weighted, latency, failover, geolocation, …
// source: https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html
// source: https://docs.aws.amazon.com/general/latest/gr/elb.html
// source: https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html
export const dns: Scene = mapFrame('dns-resolution', [...BUILT_BY[4], 'dns'], {
  id: 'dns-pane',
  label: 'side',
  bare: true,
  children: [
    { id: 'alias-json', kind: 'code', filename: 'infra/dns/shop-alias.json', label: code.replace(/\n+$/, ''), highlight: [7, 8, 9, 10, 11, 12] },
    { id: 'dns-run', kind: 'terminal', filename: 'Terminal — shop-on-aws · emulated', label: session.replace(/\n+$/, '') },
    {
      id: 'resolve',
      kind: 'table',
      label: 'shop.example.com, resolved',
      headers: ['asked', 'answers'],
      values: [
        ['the shopper’s resolver', 'asks the .com servers who holds example.com'],
        ['Route 53, zone example.com', 'the alias: the ALB’s current addresses'],
        ['the shopper', 'connects to one of them on 443'],
      ],
    },
    {
      id: 'policies',
      kind: 'list',
      icon: 'route53',
      label: 'Routing policies, beyond simple',
      pattern: 'network',
      items: ['Weighted: split by percentage — Course 13’s cutover', 'Failover: a standby answers when health fails', 'Latency: the nearest Region answers'],
    },
  ],
})
