import type { Scene } from '@graphlearning/flow'

// §1.3 — failure boundaries for the ordering app in its home Region, eu-west-2 (London): three
// Availability Zones with two app servers each, a Regional service, and the global services that sit
// outside any one Region. The N+1 arithmetic: peak needs 4 servers; 1 per AZ leaves 2 after an AZ
// loss, 2 per AZ (6 total) leaves 4.
// source: https://docs.aws.amazon.com/ram/latest/userguide/working-with-az-ids.html (AZ names may map
// to different physical zones per account in some Regions; AZ IDs are the same in every account)
export const regionBoundaries: Scene = {
  id: 'region-boundaries',
  title: 'Region, Availability Zones, and global services',
  flow: 'TB',
  padding: 0.05,
  nodes: [
    {
      id: 'region',
      label: 'Region eu-west-2 (London) · zones eu-west-2a, 2b, 2c',
      pattern: 'group',
      cols: 3,
      children: [
        {
          id: 'az-a',
          label: 'AZ a',
          pattern: 'group',
          cols: 1,
          children: [
            { id: 'a1', label: 'app 1', variant: 'chip', pattern: 'service' },
            { id: 'a2', label: 'app 2', variant: 'chip', pattern: 'service' },
          ],
        },
        {
          id: 'az-b',
          label: 'AZ b',
          pattern: 'group',
          cols: 1,
          children: [
            { id: 'b1', label: 'app 3', variant: 'chip', pattern: 'service' },
            { id: 'b2', label: 'app 4', variant: 'chip', pattern: 'service' },
          ],
        },
        {
          id: 'az-c',
          label: 'AZ c',
          pattern: 'group',
          cols: 1,
          children: [
            { id: 'c1', label: 'app 5', variant: 'chip', pattern: 'warn' },
            { id: 'c2', label: 'app 6', variant: 'chip', pattern: 'warn' },
          ],
        },
        { id: 'regional-s3', label: 'S3 bucket', sub: 'Regional, spans AZs', pattern: 'storage', icon: 's3' },
        { id: 'regional-elb', label: 'Load balancer', sub: 'nodes in each AZ', pattern: 'network', icon: 'elb' },
        { id: 'regional-rds', label: 'Orders DB', sub: 'placed in an AZ', pattern: 'storage', icon: 'rds' },
      ],
    },
    {
      id: 'global',
      label: 'Global services — not in one Region',
      pattern: 'group',
      cols: 3,
      children: [
        { id: 'g-iam', label: 'IAM', sub: 'identities, policies', pattern: 'external', icon: 'iam' },
        { id: 'g-r53', label: 'Route 53', sub: 'DNS', pattern: 'external', icon: 'route53' },
        { id: 'g-cf', label: 'CloudFront', sub: 'edge locations', pattern: 'external', icon: 'cloudfront' },
      ],
    },
    {
      id: 'n-plus-one',
      kind: 'list',
      framed: true,
      label: 'Peak needs 4 servers: survive one AZ',
      icon: 'gauge',
      pattern: 'service',
      items: [
        '1 per AZ = 3 → an AZ fails → 2 left ✗',
        '2 per AZ = 6 → an AZ fails → 4 left ✓',
      ],
    },
  ],
  edges: [],
}
