import type { Scene } from '@graphlearning/flow'
import { BUILT_BY, mapFrame } from '../map'
import code from '../../../spine/evolve/10-cutover/project/infra/13-cutover.sh?raw'
import session from '../../../spine/evolve/10-cutover/session.txt?raw'

// ALB weighted target groups split a listener's traffic by weight; a staged cutover moves the weight
// step by step with a gate at each step; rollback is moving the weight back while both paths still
// run. The acked/stored counts are the cutover's example log (labelled); the weights are moto's.
// source: https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html#forward-actions
// source: https://docs.aws.amazon.com/prescriptive-guidance/latest/migration-retiring-applications/cutover.html
export const cutover: Scene = mapFrame('staged-cutover', BUILT_BY[13], {
  id: 'cutover-pane',
  label: 'side',
  bare: true,
  children: [
    { id: 'cutover-sh', kind: 'code', filename: 'infra/13-cutover.sh', label: code.replace(/\n+$/, ''), show: [[6, 17]], highlight: [12, 13, 14, 15] },
    { id: 'cutover-run', kind: 'terminal', filename: 'Terminal — shop-on-aws · emulated', label: session.replace(/\n+$/, '') },
    {
      id: 'boundaries',
      kind: 'table',
      label: 'Rollback boundaries',
      headers: ['until', 'rolling back is'],
      values: [
        ['both paths still run', 'moving a weight: seconds'],
        ['EC2 servers are terminated', 'a redeploy: an hour'],
        ['the new path writes a new schema', 'a data migration: days'],
      ],
    },
  ],
})
