import type { Scene, SceneNode } from '@graphlearning/flow'

// Service scope. IAM, Route 53, CloudFront and Organizations are global services; S3 buckets, DynamoDB
// tables, SQS queues, Lambda functions and VPCs live in one Region; an EC2 instance, an EBS volume and
// a subnet live in one AZ. S3 Standard stores data across at least three AZs; DynamoDB replicates
// across multiple AZs; an EBS volume attaches only to instances in its own AZ.
// source: https://docs.aws.amazon.com/whitepapers/latest/aws-fault-isolation-boundaries/global-services.html
// source: https://docs.aws.amazon.com/AmazonS3/latest/userguide/DataDurability.html
// source: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.Partitions.html
// source: https://docs.aws.amazon.com/ebs/latest/userguide/ebs-volumes.html
const tile = (id: string, label: string, icon: string): SceneNode => ({ id, label, icon, variant: 'tile' })

export const scopes: Scene = {
  id: 'service-scopes',
  padding: 0.04,
  header: 'band',
  nodes: [
    {
      id: 'three',
      label: 'Three scopes',
      bare: true,
      flow: 'LR',
      align: 'start',
      stretch: true,
      children: [
        { id: 'global', label: 'Global', sub: 'one for the whole account', pattern: 'user', icon: 'globe', cols: 2, children: [tile('g-iam', 'IAM', 'iam'), tile('g-r53', 'Route 53', 'route53'), tile('g-cf', 'CloudFront', 'cloudfront'), tile('g-org', 'Organizations', 'organizations')] },
        { id: 'regional', label: 'Regional', sub: 'in one Region, across its AZs', pattern: 'network', icon: 'awscloud', cols: 3, children: [tile('r-s3', 'S3 bucket', 's3'), tile('r-ddb', 'DynamoDB table', 'dynamodb'), tile('r-sqs', 'SQS queue', 'sqs'), tile('r-fn', 'Lambda function', 'lambda'), tile('r-vpc', 'VPC', 'vpc')] },
        { id: 'zonal', label: 'Zonal', sub: 'in one Availability Zone', pattern: 'service', icon: 'server', cols: 2, children: [tile('z-ec2', 'EC2 instance', 'ec2'), tile('z-ebs', 'EBS volume', 'ebs'), tile('z-subnet', 'Subnet', 'vpc')] },
      ],
    },
    {
      id: 'below',
      label: 'What it means',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        {
          id: 'meaning',
          kind: 'table',
          label: 'What "in eu-west-2" means, resource by resource',
          headers: ['resource', 'you choose', 'when one AZ fails'],
          values: [
            ['IAM role', 'nothing — it is global', 'unaffected'],
            ['S3 bucket', 'its Region', 'data kept: stored in 3+ AZs'],
            ['DynamoDB table', 'its Region', 'data kept: copies in several AZs'],
            ['subnet', 'its AZ', 'gone with the AZ'],
            ['EC2 instance', 'its subnet, so its AZ', 'gone with the AZ'],
            ['EBS volume', 'its AZ', 'gone; attaches in its own AZ only'],
          ],
        },
        {
          id: 'choose',
          kind: 'list',
          icon: 'globe',
          label: 'Choosing a Region',
          pattern: 'network',
          items: [
            'Close to the shoppers: lower latency',
            'Where the data is allowed to live',
            'Price, which differs by Region',
            'Whether every service you need is there',
          ],
        },
      ],
    },
  ],
  edges: [],
}
