import type { Scene } from '@graphlearning/flow'
import { BUILT_BY, mapFrame } from '../map'
import code from '../../../spine/run/06-scaling/project/infra/06-scaling.sh?raw'
import session from '../../../spine/run/06-scaling/session.txt?raw'

// An Auto Scaling group balances instances across the AZs of its subnets, replaces instances that
// fail EC2 or (with HealthCheckType ELB) load-balancer health checks, and runs scheduled actions in
// a given time zone. The emulator places the three instances in one AZ; AWS balances them, one per
// AZ, so the frame shows the group's sizes instead. tools/surge.py is a model, not AWS.
// source: https://docs.aws.amazon.com/autoscaling/ec2/userguide/auto-scaling-benefits.html
// source: https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-health-checks.html
// source: https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-scheduled-scaling.html
export const scaling: Scene = mapFrame('scaling-timeline', [...BUILT_BY[5], 'app'], {
  id: 'scaling-pane',
  label: 'side',
  bare: true,
  children: [
    { id: 'scaling-script', kind: 'code', filename: 'infra/06-scaling.sh', label: code.replace(/\n+$/, ''), show: [[11, 18]], highlight: [12, 13, 15, 16, 18] },
    { id: 'scaling-run', kind: 'terminal', filename: 'Terminal — shop-on-aws · emulated, then a model', label: session.replace(/\n+$/, '') },
    {
      id: 'asg-rules',
      kind: 'list',
      icon: 'repeat',
      label: 'What the group does on its own',
      pattern: 'service',
      items: [
        'Spreads min 3 across app-a, app-b, app-c: one per AZ on AWS (the emulator put all three in 2a)',
        'Replaces a server the load balancer marks unhealthy, after a 120 s grace period',
        'At 17:45 London time raises the minimum to 6 — before the surge, not after it',
      ],
    },
  ],
})
