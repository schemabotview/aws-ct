import type { Scene } from '@graphlearning/flow'

// §10.4 — operating fleets without SSH: inventory and patch compliance through Systems Manager
// (CLI parameters model-checked) and configuration compliance through an AWS Config managed rule
// (request validated in full). Config DETECTS a non-compliant bucket; it does not by itself fix it.
// source: https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-inventory.html
// source: https://docs.aws.amazon.com/config/latest/developerguide/s3-bucket-public-read-prohibited.html
export const opsAccess: Scene = {
  id: 'ops-access',
  title: 'Know what runs, and how it is configured',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'ssm',
      kind: 'code',
      filename: 'fleet.sh · model-checked',
      hug: true,
      label: `# what is installed on each order-api server
aws ssm list-inventory-entries \\
  --instance-id i-0a1b2c3d4e5f60001 --type-name AWS:Application
# which servers are missing patches
aws ssm describe-instance-patch-states-for-patch-group \\
  --patch-group order-api
# a shell for an operator, recorded, no port 22
aws ssm start-session --target i-0a1b2c3d4e5f60001`,
    },
    {
      id: 'config',
      kind: 'code',
      filename: 'config.PutConfigRule.request.json · model-checked',
      hug: true,
      label: `{
  "ConfigRule": {
    "ConfigRuleName": "s3-no-public-read",
    "Source": {
      "Owner": "AWS",
      "SourceIdentifier": "S3_BUCKET_PUBLIC_READ_PROHIBITED"
    },
    "Scope": { "ComplianceResourceTypes": ["AWS::S3::Bucket"] }
  }
}`,
    },
    {
      id: 'questions',
      kind: 'table',
      label: 'Operational questions and their tools',
      sub: 'all answered through IAM, all recorded',
      headers: ['question', 'tool'],
      values: [
        ['what software is on it?', 'SSM Inventory'],
        ['is it patched?', 'SSM Patch Manager'],
        ['is it configured as intended?', 'AWS Config rules'],
        ['can I get a shell?', 'Session Manager'],
      ],
    },
  ],
  edges: [],
}
