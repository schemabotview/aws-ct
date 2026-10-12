import type { Scene } from '@graphlearning/flow'

// §9.6 — releasing order-api 1.5.0, which (unknown to us) fails 2% of requests: failed requests before
// an error alarm (2 min in) triggers rollback, at 560 req/s, under three traffic-shift strategies.
// CodeDeploy for ECS provides blue/green with predefined linear, canary and all-at-once
// configurations; the deployment runs under its own role, not a person's.
// source: https://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-configurations.html
// source: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/deployment-type-bluegreen.html
export const deploymentStrategies: Scene = {
  id: 'deployment-strategies',
  title: 'How much traffic meets a bad release?',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'shift',
      label: 'Blue/green: shift traffic, keep the old version',
      pattern: 'group',
      cols: 3,
      children: [
        { id: 'blue', label: 'blue: 1.4.2', sub: 'serving, kept warm', pattern: 'service', icon: 'fargate' },
        { id: 'lb', label: 'Load balancer', sub: 'moves the share', pattern: 'network', icon: 'elb' },
        { id: 'green', label: 'green: 1.5.0', sub: '10% → 100%', pattern: 'warn', icon: 'fargate' },
      ],
    },
    {
      id: 'strategy',
      kind: 'code',
      filename: 'traffic_shift.py · runs locally',
      hug: true,
      label: `RATE = 560          # req/s at the evening peak
BAD = 0.02          # the new release fails 2% of its requests
ALARM_AFTER = 120   # error alarm fires 2 minutes into the shift

def failed(share_at):  # share_at(t) = fraction of traffic on new
    return sum(RATE * share_at(t) * BAD for t in range(ALARM_AFTER))

strategies = {
    "all at once": lambda t: 1.0,
    "linear 10%/min": lambda t: min(1.0, 0.1 * (t // 60 + 1)),
    "canary 10%": lambda t: 0.1,
}
for name, share in strategies.items():
    print(f"{name:<15} {failed(share):>6.0f} failed requests"
          " before rollback")`,
    },
    {
      id: 'strategy-out',
      kind: 'code',
      filename: 'output',
      hug: true,
      label: `all at once       1344 failed requests before rollback
linear 10%/min     202 failed requests before rollback
canary 10%         134 failed requests before rollback`,
    },
    {
      id: 'deploy',
      kind: 'code',
      filename: 'deploy.sh · model-checked',
      hug: true,
      label: `aws deploy create-deployment \\
  --application-name order-api \\
  --deployment-group-name prod \\
  --deployment-config-name \\
    CodeDeployDefault.ECSLinear10PercentEvery1Minutes \\
  --revision file://appspec-revision.json`,
    },
  ],
  edges: [],
}
