import type { Scene } from '@graphlearning/flow'

// §9.5 — protecting the stateful resource: DeletionPolicy and UpdateReplacePolicy set EXPLICITLY to
// Snapshot (UpdateReplacePolicy defaults to Delete), DeletionProtection on. The failed update below is
// illustrative of the event sequence: CloudFormation rolls the STACK back, but data a migration wrote
// before the failure stays written.
// source: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-updatereplacepolicy.html
// source: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-deletionpolicy.html
export const rollbackAndProtection: Scene = {
  id: 'rollback-and-protection',
  title: 'Rollback restores the stack, not the data',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'protect',
      kind: 'code',
      filename: 'orders-db.yaml · model-checked',
      hug: true,
      label: `AWSTemplateFormatVersion: "2010-09-09"
Resources:
  OrdersDb:
    Type: AWS::RDS::DBInstance
    DeletionPolicy: Snapshot        # stack deleted -> keep a snapshot
    UpdateReplacePolicy: Snapshot   # replaced -> snapshot the old one
    Properties:
      DBInstanceIdentifier: shop-orders
      Engine: postgres
      DBInstanceClass: db.m7g.large
      AllocatedStorage: "100"
      StorageEncrypted: true
      MultiAZ: true
      MasterUsername: shop_admin
      ManageMasterUserPassword: true
      BackupRetentionPeriod: 7
      DeletionProtection: true      # API deletes refused too`,
    },
    {
      id: 'events',
      kind: 'code',
      filename: 'stack-events.txt · illustrative',
      hug: true,
      label: `18:40:02 UPDATE_IN_PROGRESS     shop-prod (v15)
18:40:05 UPDATE_COMPLETE        OrderEventsQueue
18:41:30 UPDATE_FAILED          OrderApiService
         "Resource handler returned: service did
          not stabilize (tasks failing health checks)"
18:41:31 UPDATE_ROLLBACK_IN_PROGRESS  shop-prod
18:44:10 UPDATE_ROLLBACK_COMPLETE     shop-prod (v14)
# the v15 schema migration already ran at 18:40:20:
# its new column is still in the database`,
    },
  ],
  edges: [],
}
