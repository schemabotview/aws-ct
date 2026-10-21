import type { Scene, SceneNode } from '@graphlearning/flow'

// eu-west-2 has three Availability Zones; an AZ is one or more data centres with redundant power,
// networking and connectivity, linked to the Region's other AZs by low-latency networking. AZ names
// are mapped per account; the AZ ID (euw2-az1 …) names the same zone in every account.
// source: https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions-availability-zones.html
// source: https://docs.aws.amazon.com/ram/latest/userguide/working-with-az-ids.html
// The peak numbers are the shop's (CLAUDE.md): 4 servers needed at 560 req/s; 2 per AZ = 6.
const dc = (id: string): SceneNode => ({ id, label: 'data centre', variant: 'chip', icon: 'building', pattern: 'network' })
const app = (id: string, label: string, pattern: SceneNode['pattern'] = 'service'): SceneNode => ({ id, label, variant: 'chip', icon: 'server', pattern })
const az = (id: string, label: string, n: number, down = false): SceneNode => ({
  id,
  label,
  sub: down ? 'lost' : undefined,
  pattern: down ? 'warn' : 'network',
  icon: 'none',
  cols: 2,
  children: [dc(`${id}-dc1`), dc(`${id}-dc2`), app(`${id}-app1`, `app-${n}`, down ? 'warn' : 'service'), app(`${id}-app2`, `app-${n + 1}`, down ? 'warn' : 'service')],
})

export const regions: Scene = {
  id: 'region-boundaries',
  padding: 0.04,
  header: 'band',
  nodes: [
    {
      id: 'region',
      label: 'Region eu-west-2 · London',
      icon: 'awscloud',
      pattern: 'network',
      flow: 'LR',
      align: 'start',
      children: [az('az-a', 'eu-west-2a', 1), az('az-b', 'eu-west-2b', 3), az('az-c', 'eu-west-2c', 5, true)],
    },
    {
      id: 'below',
      label: 'Boundaries and failures',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        {
          id: 'facts',
          kind: 'list',
          icon: 'globe',
          label: 'The two boundaries',
          pattern: 'network',
          items: [
            'A Region is a separate geographic area: its own services and endpoints',
            'eu-west-2 has three Availability Zones, a, b and c',
            'An AZ is one or more data centres with their own power and network',
            'AZs in a Region are joined by fast, private links',
            'Names are per account: your 2a may be my 2b — the AZ ID is not',
          ],
        },
        {
          id: 'blast',
          kind: 'table',
          label: 'Which failure, which boundary',
          headers: ['failure', 'takes out', 'the shop survives on'],
          values: [
            ['a server', 'one instance', 'another server'],
            ['a data centre', 'part of one AZ', 'servers in other AZs'],
            ['an AZ', 'all of eu-west-2c', 'the other two AZs'],
            ['a Region', 'all of eu-west-2', 'a second Region'],
          ],
        },
        {
          id: 'peak-az',
          kind: 'table',
          label: 'The evening peak with one AZ lost',
          headers: ['spread', 'servers', 'left', 'enough for 4?'],
          values: [
            ['2 + 2, two AZs', '4', '2', 'no'],
            ['2 + 2 + 2, three AZs', '6', '4', 'yes'],
          ],
        },
      ],
    },
  ],
  edges: [],
}
