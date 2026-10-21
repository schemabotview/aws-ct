import type { Scene } from '@graphlearning/flow'
import { BUILT_BY, mapFrame } from '../map'
import code from '../../../spine/network/02-vpc/project/infra/05-network.sh?raw'
import session from '../../../spine/network/02-vpc/session.txt?raw'

// A subnet lives in one AZ; a VPC spans the Region. Each server gets an elastic network interface
// (ENI) in a subnet, with a private address from that subnet's range.
// source: https://docs.aws.amazon.com/vpc/latest/userguide/configure-subnets.html
// source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-eni.html
export const vpc: Scene = mapFrame('vpc-layout', BUILT_BY[4], {
  id: 'vpc-pane',
  label: 'side',
  bare: true,
  children: [
    { id: 'vpc-script', kind: 'code', filename: 'infra/05-network.sh', label: code.replace(/\n+$/, ''), show: [[5, 18]], highlight: [5, 11, 12] },
    { id: 'vpc-run', kind: 'terminal', filename: 'Terminal — shop-on-aws · emulated', label: session.replace(/\n+$/, '') },
    {
      id: 'placement',
      kind: 'table',
      label: 'Three tiers, three AZs: what goes where',
      headers: ['tier', 'holds', 'reached from'],
      values: [
        ['public', 'load balancer, NAT gateway', 'the internet'],
        ['app', 'app servers (ENI 10.20.11.37 in app-b)', 'the load balancer only'],
        ['data', 'the orders database', 'the app servers only'],
      ],
    },
  ],
})
