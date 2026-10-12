import type { Scene } from '@graphlearning/flow'

// §4.1 — the same order API on four compute models, compared on what you manage, how you pay and the
// limits that matter for its shape. Lambda's maximum timeout is 900 s (15 min); EC2 Linux instances
// bill per second; Fargate bills vCPU and memory per second; EKS adds a per-cluster hourly charge.
// source: https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html
// source: https://aws.amazon.com/eks/pricing/
export const computeChoice: Scene = {
  id: 'compute-choice',
  title: 'Four homes for one order API',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'models',
      label: 'Who runs what',
      pattern: 'group',
      cols: 2,
      children: [
        { id: 'm-ec2', label: 'EC2', sub: 'you run the OS', pattern: 'service', icon: 'ec2' },
        { id: 'm-fargate', label: 'ECS on Fargate', sub: 'you run containers', pattern: 'service', icon: 'fargate' },
        { id: 'm-lambda', label: 'Lambda', sub: 'you run functions', pattern: 'service', icon: 'lambda' },
        { id: 'm-eks', label: 'EKS', sub: 'you run Kubernetes', pattern: 'service', icon: 'boxes' },
      ],
    },
    {
      id: 'compare',
      kind: 'table',
      label: 'Compared on the order API’s needs',
      sub: 'steady HTTP all day, long-lived DB connections',
      headers: ['', 'EC2', 'Fargate', 'Lambda', 'EKS'],
      values: [
        ['you patch', 'OS + app', 'image', 'code deps', 'nodes + app'],
        ['unit', 'instance', 'task', 'invocation', 'pod'],
        ['billed by', 'second', 'vCPU, GB / s', 'request, GB-s', '+ cluster hour'],
        ['longest run', 'unlimited', 'unlimited', '15 min', 'unlimited'],
        ['cold start', 'minutes', '~a minute', 'per new env', 'minutes'],
      ],
    },
    {
      id: 'shape',
      kind: 'list',
      framed: true,
      label: 'The order API’s shape decides',
      icon: 'gauge',
      pattern: 'network',
      items: [
        '560 req/s at peak, 60 overnight',
        'holds PostgreSQL connections open',
        'one service, one team, weekly deploys',
        'provisional pick: containers on Fargate',
      ],
    },
  ],
  edges: [],
}
