import type { Scene } from '@graphlearning/flow'

// §9.4 — what a change set would propose, predicted from AWS's resource provider schemas (bundled
// with cfn-lint): properties listed as createOnlyProperties force REPLACEMENT — a new resource with a
// new identity (and, for a database, an empty one unless data is migrated). A change set previews the
// change; it cannot guarantee success (quotas, names in use, permissions, service errors), and drift
// detection compares live resources with the template.
// source: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-changesets.html
// source: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-stack-drift.html
export const changeSets: Scene = {
  id: 'change-sets',
  title: 'Read the change set before the change',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'replace',
      kind: 'code',
      filename: 'replacement_preview.py · runs locally',
      hug: true,
      label: `from cfnlint.schema import PROVIDER_SCHEMA_MANAGER

# properties changed between template v14 and v15
changes = {
    "AWS::RDS::DBInstance": ["DBInstanceClass", "StorageEncrypted",
                             "BackupRetentionPeriod"],
    "AWS::SQS::Queue": ["VisibilityTimeout", "QueueName"],
}
for rtype, props in changes.items():
    schema = PROVIDER_SCHEMA_MANAGER.get_resource_schema(
        "eu-west-2", rtype).schema  # AWS's resource provider schema
    create_only = {p.split("/")[-1]
                   for p in schema.get("createOnlyProperties", [])}
    for prop in props:
        action = "REPLACE (new resource)" if prop in create_only \\
            else "update in place"
        print(f"{rtype.split('::')[1]:<6} {prop:<22} -> {action}")`,
    },
    {
      id: 'replace-out',
      kind: 'code',
      filename: 'output',
      hug: true,
      label: `RDS    DBInstanceClass        -> update in place
RDS    StorageEncrypted       -> REPLACE (new resource)
RDS    BackupRetentionPeriod  -> update in place
SQS    VisibilityTimeout      -> update in place
SQS    QueueName              -> REPLACE (new resource)`,
    },
    {
      id: 'limits',
      kind: 'table',
      label: 'What a change set does and does not tell you',
      sub: 'a preview, not a promise',
      headers: ['question', 'change set?'],
      values: [
        ['which resources change', 'yes'],
        ['replace or update in place', 'yes, per resource'],
        ['will the update succeed', 'no'],
        ['what happens to the data', 'no'],
        ['what changed by hand', 'no — run drift detection'],
      ],
    },
  ],
  edges: [],
}
