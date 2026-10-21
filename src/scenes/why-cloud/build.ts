import type { Scene } from '@graphlearning/flow'
import { BUILT_BY, mapFrame } from '../map'

// The finished shop: every part of the map built, beside the course as the order it is built in.
export const build: Scene = mapFrame('shop-on-aws', BUILT_BY[13], {
  id: 'build-side',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'route',
      kind: 'table',
      label: 'The course is the order we build it in',
      headers: ['course', 'the shop gains'],
      values: [
        ['3  start', 'a project, a first bucket, a cost ledger'],
        ['4  secure', 'two accounts, people and roles'],
        ['5  network', 'a VPC, DNS and a load balancer'],
        ['6  run', 'app servers in three zones'],
        ['7  automate', 'stacks and a release pipeline'],
        ['8  files', 'buckets, volumes, encryption keys'],
        ['9  orders', 'the orders database, a table, a cache'],
        ['10 decouple', 'the API, functions, queues, events'],
        ['11 report', 'a lake, its catalog, Athena'],
        ['12 operate', 'telemetry, audit, firewall, backups'],
        ['13 evolve', 'an edge cache, a priced, reviewed map'],
      ],
    },
    {
      id: 'rules',
      kind: 'list',
      icon: 'layers',
      label: 'How to read the map',
      pattern: 'user',
      items: [
        'Every part keeps its place from the first frame to the last',
        'A grey outline is a part the shop has not built yet',
        'Alternatives are drawn beside the map, never inside it',
        'Numbers come from one fixed example, labelled when assumed',
      ],
    },
  ],
})
