import type { Scene } from '@graphlearning/flow'

// §3.2 — the production VPC laid out: one VPC across the Region's three AZs, three tiers of /24
// subnets per AZ. A subnet lives in exactly one AZ; a network interface (ENI) lives in one subnet and
// takes its private address from it.
// source: https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html
const az = (k: string, n: number) => ({
  id: `az-${k}`,
  label: `AZ ${k}`,
  pattern: 'group' as const,
  cols: 1,
  children: [
    { id: `public-${k}`, label: `public-${k}`, sub: `10.20.${n}.0/24`, pattern: 'network' as const, icon: 'dooropen' },
    { id: `app-${k}`, label: `app-${k}`, sub: `10.20.${10 + n}.0/24`, pattern: 'service' as const, icon: 'ec2' },
    { id: `data-${k}`, label: `data-${k}`, sub: `10.20.${20 + n}.0/24`, pattern: 'storage' as const, icon: 'rds' },
  ],
})

export const vpcLayout: Scene = {
  id: 'vpc-layout',
  title: 'One VPC, three AZs, three tiers',
  flow: 'TB',
  padding: 0.05,
  nodes: [
    {
      id: 'vpc',
      label: 'VPC shop-prod · 10.20.0.0/16 · eu-west-2',
      pattern: 'group',
      cols: 3,
      children: [az('a', 0), az('b', 1), az('c', 2)],
    },
    {
      id: 'placement',
      kind: 'list',
      framed: true,
      label: 'Placement rules',
      icon: 'network',
      pattern: 'network',
      items: [
        'a VPC spans every AZ of its Region',
        'a subnet sits in exactly one AZ',
        'an ENI sits in one subnet; its IP comes from it',
        'app-b server: ENI 10.20.11.37 in AZ b',
      ],
    },
  ],
  edges: [],
}
