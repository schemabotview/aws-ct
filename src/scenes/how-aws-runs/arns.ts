import type { Scene, SceneNode } from '@graphlearning/flow'

// ARN format: arn:partition:service:region:account-id:resource. Global services (IAM) leave the
// Region empty; S3 bucket ARNs leave Region and account empty because bucket names are global.
// i-0123456789abcdef0 is the documentation's example instance id.
// source: https://docs.aws.amazon.com/IAM/latest/UserGuide/reference-arns.html
const field = (id: string, label: string, sub: string, pattern: SceneNode['pattern']): SceneNode => ({ id, label, sub, pattern, icon: 'none' })

export const arns: Scene = {
  id: 'arn-anatomy',
  padding: 0.04,
  flow: 'LR',
  align: 'start',
  header: 'band',
  nodes: [
    {
      id: 'fields',
      label: 'arn:aws:sqs:eu-west-2:111122223333:order-events',
      bare: true,
      framed: true,
      cols: 2,
      children: [
        field('f-arn', 'arn', 'always first', 'group'),
        field('f-part', 'aws', 'partition', 'user'),
        field('f-svc', 'sqs', 'service', 'service'),
        field('f-region', 'eu-west-2', 'Region', 'network'),
        field('f-acct', '111122223333', 'account', 'user'),
        field('f-res', 'order-events', 'resource', 'storage'),
      ],
    },
    {
      id: 'more',
      label: 'More of them',
      bare: true,
      children: [
        {
          id: 'examples',
          kind: 'table',
          label: 'The shop’s resources, by ARN',
          headers: ['resource', 'ARN'],
          values: [
            ['the order queue', 'arn:aws:sqs:eu-west-2:111122223333:order-events'],
            ['the app’s role', 'arn:aws:iam::111122223333:role/OrderApi'],
            ['the catalog bucket', 'arn:aws:s3:::shop-catalog-111122223333'],
            ['one product file', 'arn:aws:s3:::shop-catalog-111122223333/products/p-1001.json'],
            ['every product file', 'arn:aws:s3:::shop-catalog-111122223333/products/*'],
            ['a server', 'arn:aws:ec2:eu-west-2:111122223333:instance/i-0123456789abcdef0'],
          ],
        },
        {
          id: 'read',
          kind: 'list',
          icon: 'search',
          label: 'Reading one',
          pattern: 'network',
          items: [
            'An empty field means the service does not need it',
            'IAM is global: no Region',
            'Bucket names are global: no Region, no account',
            'A * matches many: every product file',
            'Policies name what they allow by ARN — Course 4',
          ],
        },
      ],
    },
  ],
  edges: [],
}
