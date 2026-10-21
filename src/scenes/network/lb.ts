import type { Scene } from '@graphlearning/flow'
import { BUILT_BY, mapFrame } from '../map'
import session from '../../../spine/network/08-lb/session.txt?raw'

// A target group health-checks each target; after UnhealthyThresholdCount consecutive failures the
// ALB stops routing to it, after HealthyThresholdCount successes it resumes. The timeline is
// tools/health_timeline.py, a model of those settings, run for real — not an AWS measurement.
// source: https://docs.aws.amazon.com/elasticloadbalancing/latest/application/target-group-health-checks.html
export const lb: Scene = mapFrame('lb-health', [...BUILT_BY[4], 'dns', 'lb'], {
  id: 'lb-pane',
  label: 'side',
  bare: true,
  children: [
    { id: 'lb-run', kind: 'terminal', filename: 'Terminal — shop-on-aws · emulated, then a model', label: session.replace(/\n+$/, '') },
    {
      id: 'tg',
      kind: 'table',
      label: 'Target group shop-app',
      headers: ['setting', 'value', 'means'],
      values: [
        ['protocol, port', 'HTTP 8080', 'what the ALB sends to a server'],
        ['health check', 'GET /health every 10 s', 'the app answers 200 when ready'],
        ['unhealthy after', '2 failures', 'out at 15 s'],
        ['healthy after', '3 successes', 'back at 85 s'],
      ],
    },
  ],
})
