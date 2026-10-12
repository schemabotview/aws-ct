import type { Scene } from '@graphlearning/flow'

// §1.1 — the course's first sketch of the ordering app: one product-page request, beside the day's
// demand against two ways of providing capacity. SHARED BOARD: later chapters reuse the request
// path with `focus:` on `browser`, `dns`, `lb`, `app`, `db` or `images`, so keep those ids stable.
//
// The numbers are the course's fixed traffic profile (CLAUDE.md): 60 req/s 00–08, 240 req/s 08–18,
// 560 req/s 18–24; one app server handles 150 req/s. Elastic: 1, 2, 4 servers = 52 server-hours a
// day. Fixed at peak: 4 × 24 = 96.
export const productPage: Scene = {
  id: 'product-page',
  title: 'One product-page request, and one day of demand',
  cols: 1,
  padding: 0.05,
  nodes: [
    {
      id: 'request',
      label: 'GET /products/p-1001',
      pattern: 'group',
      flow: 'TB',
      children: [
        { id: 'browser', label: 'Shopper', sub: 'a browser', pattern: 'user', icon: 'globe' },
        { id: 'dns', label: 'Route 53', sub: 'name → address', pattern: 'network', icon: 'route53' },
        { id: 'lb', label: 'Load balancer', sub: 'managed, spreads load', pattern: 'network', icon: 'elb' },
        { id: 'app', label: 'App servers', sub: 'you run: 1 to 4', pattern: 'service', icon: 'ec2' },
        { id: 'db', label: 'Orders DB', sub: 'managed engine', pattern: 'storage', icon: 'rds' },
        { id: 'images', label: 'Product images', sub: 'object storage', pattern: 'storage', icon: 's3' },
      ],
      edges: [
        { source: 'browser', target: 'dns', label: 'lookup' },
        { source: 'browser', target: 'lb', label: 'HTTPS' },
        { source: 'lb', target: 'app' },
        { source: 'app', target: 'db', label: 'SQL' },
        { source: 'app', target: 'images', label: 'URL' },
      ],
    },
    {
      id: 'demand-plot',
      kind: 'plot',
      label: 'Demand against capacity, one day',
      sub: '150 req/s per server',
      plot: {
        x: { min: 0, max: 24, step: 6, label: 'hour' },
        y: { min: 0, max: 700, step: 100, label: 'req/s' },
        axes: 'corner',
        series: [
          { kind: 'line', label: 'fixed: 4 servers', color: 'warn', dashed: true, points: [[0, 600], [24, 600]], labelAt: [3, 640] },
          {
            kind: 'line',
            label: 'elastic capacity',
            color: 'network',
            dashed: true,
            points: [[0, 150], [8, 150], [8, 300], [18, 300], [18, 600], [24, 600]],
            labelAt: [9, 340],
          },
          {
            kind: 'area',
            label: 'demand',
            color: 'service',
            points: [[0, 60], [8, 60], [8, 240], [18, 240], [18, 560], [24, 560]],
            labelAt: [1, 100],
          },
        ],
      },
    },
  ],
  edges: [],
}
