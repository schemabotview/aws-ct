import type { Scene } from '@graphlearning/flow'

// §5.7 — protections that are easy to confuse, each against the threats it does and does not stop.
// Default encryption with a KMS key (validated request); replication copies new writes and, by
// default, NOT delete markers (configurable), and a corrupt write replicates too; versioning keeps
// history but versions can be deleted by anyone allowed to; Object Lock compliance mode blocks
// deletion until retention ends, even for root; a backup is a separate, restorable copy.
// source: https://docs.aws.amazon.com/AmazonS3/latest/userguide/replication-what-is-isnot-replicated.html
// source: https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html
export const dataProtection: Scene = {
  id: 'data-protection',
  title: 'Which protection stops which loss?',
  flow: 'TB',
  padding: 0.05,
  nodes: [
    {
      id: 'encryption',
      kind: 'code',
      filename: 's3.PutBucketEncryption.request.json · model-checked',
      hug: true,
      label: `{
  "Bucket": "shop-reports-111122223333",
  "ServerSideEncryptionConfiguration": {
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "aws:kms",
        "KMSMasterKeyID": "alias/shop-reports"
      },
      "BucketKeyEnabled": true
    }]
  }
}`,
    },
    {
      id: 'threats',
      kind: 'table',
      label: 'Threat × protection',
      sub: '✓ protects · ✗ does not',
      headers: ['threat', 'replica', 'versions', 'Object Lock', 'backup'],
      values: [
        ['AZ or Region outage', '✓', '✗', '✗', '✓ if elsewhere'],
        ['accidental delete', '✗ by default', '✓', '✓', '✓'],
        ['bad overwrite', '✗ copies it', '✓', '✓', '✓'],
        ['attacker deletes', '✗', '✗', '✓', '✓ if isolated'],
        ['stolen read access', '✗', '✗', '✗', '✗'],
      ],
    },
  ],
  edges: [],
}
