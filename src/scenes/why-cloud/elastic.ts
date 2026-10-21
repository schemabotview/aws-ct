import type { Scene, SceneNode } from '@graphlearning/flow'

// Renting capacity to follow the day (CLAUDE.md): 1 / 2 / 4 servers of 150 req/s for the 60 / 240 /
// 560 req/s day → 1×8 + 2×10 + 4×6 = 52 server-hours, against 4×24 = 96 owned for the peak. At the
// course's HYPOTHETICAL $0.04 per server-hour: $2.08 against $3.84 a day.
const server = (id: string, label: string): SceneNode => ({ id, label, icon: 'ec2', variant: 'tile' })

export const elastic: Scene = {
  id: 'elastic-day',
  padding: 0.04,
  flow: 'LR',
  align: 'start',
  header: 'band',
  nodes: [
    {
      id: 'rented',
      label: 'The same shop, on rented capacity',
      bare: true,
      children: [
        {
          id: 'rented-path',
          label: 'One request',
          bare: true,
          children: [
            { id: 'shopper', label: 'Shopper', icon: 'globe', pattern: 'user', variant: 'tile' },
            { id: 'lb', label: 'Load balancer', sub: 'spreads requests over the servers', icon: 'elb', pattern: 'network' },
            {
              id: 'servers',
              label: 'App servers: 1, then 2, then 4',
              pattern: 'service',
              icon: 'none',
              cols: 4,
              children: [server('s1', 'app-1'), server('s2', 'app-2'), server('s3', 'app-3'), server('s4', 'app-4')],
            },
          ],
          edges: [
            { source: 'shopper', target: 'lb' },
            { source: 'lb', target: 'servers' },
          ],
        },
        {
          id: 'needs',
          kind: 'list',
          icon: 'clock',
          label: 'What makes it work',
          pattern: 'service',
          items: [
            'A server is an API call, ready in minutes',
            'You pay while it runs, not while it is switched off',
            'Any server can take any request — Course 6',
            'Adding one takes minutes, so plan for the delay',
          ],
        },
      ],
    },
    {
      id: 'day-side',
      label: 'The day',
      bare: true,
      children: [
        {
          id: 'day',
          kind: 'plot',
          label: 'Capacity that follows demand',
          plot: {
            x: { min: 0, max: 24, step: 4, label: 'hour of day' },
            y: { min: 0, max: 700, step: 100, label: 'requests per second' },
            series: [
              { kind: 'line', points: [[0, 60], [8, 60], [8, 240], [18, 240], [18, 560], [24, 560]], label: 'demand', labelAt: [19.5, 505], color: 'user' },
              { kind: 'line', points: [[0, 150], [8, 150], [8, 300], [18, 300], [18, 600], [24, 600]], label: 'rented: 1 / 2 / 4', labelAt: [9, 340], color: 'service' },
              { kind: 'segment', from: [0, 600], to: [24, 600], label: 'owned for the peak: 4', labelAt: [1, 640], color: 'storage' },
            ],
          },
        },
        {
          id: 'bill',
          kind: 'table',
          label: 'One day at a hypothetical $0.04 per server-hour',
          headers: ['plan', 'server-hours', 'cost'],
          values: [
            ['four, all day', '96', '$3.84'],
            ['1 / 2 / 4, following demand', '52', '$2.08'],
          ],
        },
      ],
    },
  ],
  edges: [],
}
