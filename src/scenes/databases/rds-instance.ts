import type { Scene } from '@graphlearning/flow'

// §6.2 — the orders database as RDS for PostgreSQL, validated in full against CreateDBInstance:
// Multi-AZ (one standby), encrypted storage, 7-day automated backups, deletion protection, and a
// master password RDS stores and rotates in Secrets Manager (ManageMasterUserPassword). Placed in the
// data subnets behind sg-db (Ch. 3).
// source: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-secrets-manager.html
// source: https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Overview.html
export const rdsInstance: Scene = {
  id: 'rds-instance',
  title: 'A managed PostgreSQL for orders',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'create',
      kind: 'code',
      filename: 'rds.CreateDBInstance.request.json · model-checked',
      hug: true,
      label: `{
  "DBInstanceIdentifier": "shop-orders",
  "Engine": "postgres",
  "EngineVersion": "16",
  "DBInstanceClass": "db.m7g.large",
  "AllocatedStorage": 100,
  "StorageType": "gp3",
  "StorageEncrypted": true,
  "MultiAZ": true,
  "MasterUsername": "shop_admin",
  "ManageMasterUserPassword": true,
  "DBSubnetGroupName": "shop-data",
  "VpcSecurityGroupIds": ["sg-db"],
  "BackupRetentionPeriod": 7,
  "DeletionProtection": true
}`,
    },
    {
      id: 'duties',
      kind: 'table',
      label: 'Who does what',
      sub: 'self-run on EC2 vs RDS vs Aurora',
      headers: ['job', 'on EC2', 'RDS', 'Aurora'],
      values: [
        ['install, patch engine', 'you', 'AWS*', 'AWS*'],
        ['backups, PITR', 'you', 'AWS', 'AWS'],
        ['standby, failover', 'you', 'AWS', 'AWS'],
        ['storage', 'EBS', 'EBS', '6 copies, 3 AZs'],
        ['schema, SQL, indexes', 'you', 'you', 'you'],
        ['who can connect', 'you', 'you', 'you'],
      ],
    },
  ],
  edges: [],
}
