import type { Scene } from '@graphlearning/flow'
import { BUILT_BY, mapFrame } from '../map'

// The same order API on EC2 (Auto Scaling), ECS Fargate and Lambda + API Gateway: who patches,
// how it scales, what it costs at steady load, cold starts. A comparison against the shop's
// requirement set (§7), not a benchmark.
// source: https://docs.aws.amazon.com/decision-guides/latest/compute-on-aws-how-to-choose/compute-on-aws-how-to-choose.html
// source: https://docs.aws.amazon.com/whitepapers/latest/aws-overview/compute-services.html
export const platforms: Scene = mapFrame('platform-alternatives', BUILT_BY[13], {
  id: 'platforms-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'three-ways',
      kind: 'table',
      label: 'The order API, three ways',
      headers: ['', 'VMs: EC2 + ASG', 'containers: ECS Fargate', 'serverless: Lambda'],
      values: [
        ['unit', 'a server', 'a task', 'an invocation'],
        ['who patches the OS', 'the shop', 'AWS', 'AWS'],
        ['scales in', 'minutes', 'a minute', 'milliseconds'],
        ['idle cost', 'every server', 'every task', 'none'],
        ['steady load', 'cheapest, committed', 'middle', 'dearest per request'],
        ['the database', 'pools per server', 'pools per task', 'needs RDS Proxy'],
      ],
    },
    {
      id: 'what-moves',
      kind: 'table',
      label: 'What moves when the shop changes platform',
      headers: ['part', 'EC2 → Fargate', 'Fargate → Lambda'],
      values: [
        ['the code', 'the same image', 'split into handlers'],
        ['the database', 'unchanged', 'behind RDS Proxy'],
        ['deploys', 'task definitions', 'function versions'],
        ['the load balancer', 'new target group', 'API Gateway instead'],
      ],
    },
    {
      id: 'platform-verdict',
      kind: 'list',
      icon: 'scale',
      label: 'The shop’s answer, today',
      pattern: 'service',
      items: [
        'ECS Fargate for the order API: same image, no patching (ADR-007)',
        'Lambda stays where it already fits: place-order and the workflow',
        'EC2 remains the cheapest for steady load; it loses on patching',
      ],
    },
  ],
})
