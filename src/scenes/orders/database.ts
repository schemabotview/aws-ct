import type { Scene } from '@graphlearning/flow'
import { BUILT_BY, mapFrame } from '../map'
import code from '../../../spine/orders/02-database/project/templates/orders-db.yaml?raw'
import session from '../../../spine/orders/02-database/session.txt?raw'

// RDS manages the instance: provisioning, OS and engine patching (in the maintenance window),
// automated backups, Multi-AZ failover; the customer owns schema, queries, indexes, users and
// parameter choices. ManageMasterUserPassword stores the master password in Secrets Manager.
// Aurora is a separate engine family with a cluster storage volume shared across three AZs.
// source: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html
// source: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-secrets-manager.html
// source: https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.html
export const database: Scene = mapFrame('rds-instance', [...BUILT_BY[8], 'db'], {
  id: 'database-pane',
  label: 'side',
  bare: true,
  children: [
    { id: 'orders-db-yaml', kind: 'code', filename: 'templates/orders-db.yaml', label: code.replace(/\n+$/, ''), show: [[15, 29]], highlight: [17, 18, 23, 26, 28, 29] },
    { id: 'database-run', kind: 'terminal', filename: 'Terminal — shop-on-aws · emulated', label: session.replace(/\n+$/, '') },
    {
      id: 'managed',
      kind: 'table',
      label: 'What “managed” covers',
      headers: ['RDS does', 'the shop still does'],
      values: [
        ['hardware, OS and engine patches', 'the schema, indexes and queries'],
        ['backups and point-in-time restore', 'testing that a restore works'],
        ['a standby in another AZ, failover', 'reconnecting after a failover'],
        ['the master password, in Secrets Manager', 'who may read that secret'],
      ],
    },
  ],
})
