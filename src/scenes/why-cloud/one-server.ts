import type { Scene, SceneNode } from '@graphlearning/flow'

// The shop before the cloud: one server in a cupboard against the shop's fixed day (CLAUDE.md:
// 60 / 240 / 560 req/s, one server = 150 req/s). Buying for the peak means four servers; the day's
// average demand is (60×8 + 240×10 + 560×6) / 24 = 260 req/s, so four servers are 43% busy on average.
const chip = (id: string, label: string, icon: string): SceneNode => ({ id, label, icon, variant: 'chip', pattern: 'service' })

export const oneServer: Scene = {
  id: 'one-server',
  padding: 0.04,
  flow: 'LR',
  align: 'start',
  header: 'band',
  nodes: [
    {
      id: 'owned',
      label: 'The shop on a server you own',
      bare: true,
      children: [
        {
          id: 'owned-path',
          label: 'One request',
          bare: true,
          flow: 'LR',
          children: [
            { id: 'shopper', label: 'Shopper', sub: 'GET /products/p-1001', icon: 'globe', pattern: 'user' },
            {
              id: 'server',
              label: 'One server',
              sub: 'in a cupboard',
              pattern: 'service',
              icon: 'server',
              cols: 1,
              children: [chip('web', 'web app', 'code'), chip('db', 'database', 'database'), chip('images', 'product images', 'folder')],
            },
          ],
          edges: [{ source: 'shopper', target: 'server', label: 'the internet' }],
        },
        {
          id: 'owning',
          kind: 'list',
          icon: 'wrench',
          label: 'What owning it means',
          pattern: 'service',
          items: [
            'Sized once, for one number, months ahead',
            'Growing means ordering, waiting, installing',
            'A failed disk or power supply is your call-out',
            'Capacity costs the same idle or busy',
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
          label: 'Demand over a day',
          plot: {
            x: { min: 0, max: 24, step: 4, label: 'hour of day' },
            y: { min: 0, max: 600, step: 100, label: 'requests per second' },
            series: [
              { kind: 'line', points: [[0, 60], [8, 60], [8, 240], [18, 240], [18, 560], [24, 560]], label: 'demand', labelAt: [19, 520], color: 'user' },
              { kind: 'segment', from: [0, 150], to: [24, 150], label: 'one server: 150 req/s', labelAt: [3, 185], color: 'service' },
            ],
          },
        },
        {
          id: 'tables',
          label: 'Two answers',
          bare: true,
          flow: 'LR',
          align: 'start',
          children: [
            {
              id: 'over',
              kind: 'table',
              label: 'Against one server',
              headers: ['hours', 'demand', 'over capacity'],
              values: [
                ['00–08', '60 req/s', '—'],
                ['08–18', '240 req/s', '90 req/s'],
                ['18–24', '560 req/s', '410 req/s'],
              ],
            },
            {
              id: 'peak',
              kind: 'table',
              label: 'Or buy for the evening',
              headers: ['', 'four servers'],
              values: [
                ['capacity', '600 req/s'],
                ['average demand', '260 req/s'],
                ['average busy', '43%'],
              ],
            },
          ],
        },
      ],
    },
  ],
  edges: [],
}
