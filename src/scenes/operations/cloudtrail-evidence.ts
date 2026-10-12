import type { Scene } from '@graphlearning/flow'

// §10.3 — CloudTrail records API calls (who did what to which resource); CloudWatch records how the
// system behaves (metrics, logs). Collection assumptions matter: event history holds 90 days of
// MANAGEMENT events per Region; data events (e.g. S3 object reads) need a trail or event data store
// configured to capture them. The record is illustrative; the lookup CLI is model-checked.
// source: https://docs.aws.amazon.com/awscloudtrail/latest/userguide/view-cloudtrail-events.html
// source: https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html
export const cloudtrailEvidence: Scene = {
  id: 'cloudtrail-evidence',
  title: 'Who changed the bucket policy?',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'record',
      kind: 'code',
      filename: 'cloudtrail-record.json · illustrative',
      hug: true,
      label: `{
  "eventTime": "2026-10-12T18:12:44Z",
  "eventSource": "s3.amazonaws.com",
  "eventName": "PutBucketPolicy",
  "awsRegion": "eu-west-2",
  "userIdentity": {
    "type": "AssumedRole",
    "arn": "arn:aws:sts::111122223333:assumed-role/AWSReservedSSO_ShopOperator_7c1d/sam"
  },
  "sourceIPAddress": "203.0.113.24",
  "requestParameters": {
    "bucketName": "shop-reports-111122223333"
  },
  "readOnly": false
}`,
    },
    {
      id: 'lookup',
      kind: 'code',
      filename: 'lookup.sh · model-checked',
      hug: true,
      label: `aws cloudtrail lookup-events \\
  --lookup-attributes \\
    AttributeKey=EventName,AttributeValue=PutBucketPolicy \\
  --start-time 2026-10-12T18:00:00Z`,
    },
    {
      id: 'coverage',
      kind: 'table',
      label: 'Which evidence, from where?',
      sub: 'and what must be switched on first',
      headers: ['question', 'source', 'by default?'],
      values: [
        ['who changed a policy', 'CloudTrail mgmt events', '90 days'],
        ['who read an S3 object', 'CloudTrail data events', 'no, enable'],
        ['how slow, how many errors', 'CloudWatch metrics', 'service metrics'],
        ['what the app logged', 'CloudWatch Logs', 'if shipped'],
        ['events kept for a year', 'org trail → S3', 'no, create'],
      ],
    },
  ],
  edges: [],
}
