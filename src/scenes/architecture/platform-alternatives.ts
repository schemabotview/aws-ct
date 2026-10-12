import type { Scene } from '@graphlearning/flow'

// §12.2 — the same order API as three platforms, each a request path from DNS to data, and what each
// moves between the team and AWS. Limits per earlier chapters: Lambda timeout 900 s and concurrency
// (Ch. 7, 10); Fargate tasks have no SSH (ECS Exec instead).
// source: https://docs.aws.amazon.com/decision-guides/latest/containers-on-aws-how-to-choose/choosing-aws-container-service.html
// source: https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html
export const platformAlternatives: Scene = {
  id: 'platform-alternatives',
  title: 'One order API, three platforms',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'paths',
      label: 'Request path, DNS to data',
      pattern: 'group',
      cols: 3,
      children: [
        {
          id: 'vm',
          label: 'VMs',
          pattern: 'group',
          flow: 'TB',
          children: [
            { id: 'vm-dns', label: 'Route 53', sub: 'shop.example.com', pattern: 'network', icon: 'route53' },
            { id: 'vm-lb', label: 'ALB', sub: 'HTTPS 443', pattern: 'network', icon: 'elb' },
            { id: 'vm-app', label: 'EC2 ASG', sub: '3 → 6 servers', pattern: 'service', icon: 'ec2' },
            { id: 'vm-db', label: 'RDS', sub: 'PostgreSQL', pattern: 'storage', icon: 'rds' },
          ],
          edges: [
            { source: 'vm-dns', target: 'vm-lb' },
            { source: 'vm-lb', target: 'vm-app' },
            { source: 'vm-app', target: 'vm-db' },
          ],
        },
        {
          id: 'ctr',
          label: 'Containers',
          pattern: 'group',
          flow: 'TB',
          children: [
            { id: 'ctr-dns', label: 'Route 53', sub: 'shop.example.com', pattern: 'network', icon: 'route53' },
            { id: 'ctr-lb', label: 'ALB', sub: 'HTTPS 443', pattern: 'network', icon: 'elb' },
            { id: 'ctr-app', label: 'ECS Fargate', sub: 'tasks, no hosts', pattern: 'service', icon: 'ecs' },
            { id: 'ctr-db', label: 'RDS', sub: 'PostgreSQL', pattern: 'storage', icon: 'rds' },
          ],
          edges: [
            { source: 'ctr-dns', target: 'ctr-lb' },
            { source: 'ctr-lb', target: 'ctr-app' },
            { source: 'ctr-app', target: 'ctr-db' },
          ],
        },
        {
          id: 'fn',
          label: 'Serverless',
          pattern: 'group',
          flow: 'TB',
          children: [
            { id: 'fn-dns', label: 'Route 53', sub: 'shop.example.com', pattern: 'network', icon: 'route53' },
            { id: 'fn-api', label: 'API Gateway', sub: 'stage prod', pattern: 'network', icon: 'apigateway' },
            { id: 'fn-app', label: 'Lambda', sub: 'place-order', pattern: 'service', icon: 'lambda' },
            { id: 'fn-db', label: 'DynamoDB', sub: 'Orders table', pattern: 'storage', icon: 'dynamodb' },
          ],
          edges: [
            { source: 'fn-dns', target: 'fn-api' },
            { source: 'fn-api', target: 'fn-app' },
            { source: 'fn-app', target: 'fn-db' },
          ],
        },
      ],
    },
    {
      id: 'moves',
      kind: 'table',
      label: 'What each platform moves to AWS',
      sub: 'and the new failure modes it brings',
      headers: ['', 'VMs', 'containers', 'serverless'],
      values: [
        ['team runs', 'OS, runtime, app', 'image, app', 'function code'],
        ['scales by', 'servers', 'tasks', 'concurrent requests'],
        ['idle cost', 'every server-hour', 'every task-hour', 'none'],
        ['new limits', 'patch windows', 'image pulls, ENIs', 'timeout 900 s, concurrency'],
      ],
    },
  ],
  edges: [],
}
