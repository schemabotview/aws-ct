import type { Scene } from '@graphlearning/flow'
import { BUILT_BY, mapFrame } from '../map'
import session from '../../../spine/automate/07-release/session.txt?raw'

// Rolling, blue/green and canary / linear deployments; CodeDeploy ships predefined ECS traffic-shift
// configurations such as CodeDeployDefault.ECSLinear10PercentEvery1Minutes and
// ECSCanary10Percent5Minutes, and can stop and roll back on a CloudWatch alarm.
// tools/traffic_shift.py is a model, run locally, not a measurement.
// source: https://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-configurations.html
// source: https://docs.aws.amazon.com/whitepapers/latest/overview-deployment-options/bluegreen-deployments.html
export const release: Scene = mapFrame('deployment-strategies', [...BUILT_BY[6], 'stacks', 'pipeline'], {
  id: 'release-pane',
  label: 'side',
  bare: true,
  children: [
    { id: 'release-run', kind: 'terminal', filename: 'Terminal — shop-on-aws · a model, run locally', label: session.replace(/\n+$/, '') },
    {
      id: 'strategies',
      kind: 'table',
      label: 'Three ways to put order-api 1.5.0 in front of shoppers',
      headers: ['strategy', 'how', 'rollback'],
      values: [
        ['all at once / rolling', 'replace servers in place, in batches', 'deploy the old version again'],
        ['blue/green, linear', 'a second set; shift 10% more a minute', 'shift traffic back'],
        ['blue/green, canary', '10% first, then the rest', 'shift the 10% back'],
      ],
    },
    {
      id: 'release-pipeline',
      kind: 'list',
      icon: 'codepipeline',
      label: 'The release, as a pipeline',
      pattern: 'service',
      items: [
        'Build once: one image, one digest, tested',
        'Deploy with an identity of its own, not a person’s',
        'CodeDeploy shifts the load balancer’s traffic, e.g. CodeDeployDefault.ECSLinear10PercentEvery1Minutes',
        'An alarm on errors stops the shift and shifts back',
      ],
    },
  ],
})
