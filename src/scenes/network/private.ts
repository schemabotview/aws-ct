import type { Scene, SceneNode } from '@graphlearning/flow'

// Gateway endpoints (S3, DynamoDB) are route-table targets with no hourly charge; interface
// endpoints are ENIs (PrivateLink). Peering joins two VPCs, is not transitive and needs
// non-overlapping ranges; a Transit Gateway is a hub for many. Site-to-Site VPN runs over the
// internet, encrypted; Direct Connect is a dedicated link (not encrypted by default).
// source: https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html
// source: https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-basics.html
// source: https://docs.aws.amazon.com/vpc/latest/tgw/what-is-transit-gateway.html
// source: https://docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html
const tile = (id: string, label: string, icon: string, pattern: SceneNode['pattern']): SceneNode => ({ id, label, icon, pattern, variant: 'tile' })

export const privatePaths: Scene = {
  id: 'private-connectivity',
  padding: 0.04,
  flow: 'LR',
  align: 'start',
  header: 'band',
  nodes: [
    {
      id: 'paths',
      label: 'Private paths out of shop-prod',
      bare: true,
      children: [
        {
          id: 'prod',
          label: 'VPC shop-prod 10.20.0.0/16',
          pattern: 'network',
          icon: 'vpc',
          flow: 'LR',
          children: [tile('app-server', 'app servers', 'ec2', 'service'), tile('gw-endpoint', 'S3 gateway endpoint', 'vpc', 'network')],
          edges: [{ source: 'app-server', target: 'gw-endpoint', label: 'route: S3 prefix list' }],
        },
        {
          id: 'others',
          label: 'Beyond the VPC',
          bare: true,
          flow: 'LR',
          children: [
            tile('s3-svc', 'S3, in-Region', 's3', 'storage'),
            tile('dev-vpc', 'dev VPC 10.30.0.0/16', 'vpc', 'user'),
            tile('office', 'an office, a data centre', 'building', 'external'),
          ],
        },
      ],
      edges: [
        { source: 'prod', target: 'others', label: 'endpoint · peering pcx-dev · VPN / Direct Connect' },
      ],
    },
    {
      id: 'choices',
      label: 'Choices',
      bare: true,
      children: [
        {
          id: 'compare',
          kind: 'table',
          label: 'Which private path, for what',
          headers: ['path', 'joins', 'note'],
          values: [
            ['gateway endpoint', 'a VPC to S3 or DynamoDB', 'no NAT, no hourly charge'],
            ['interface endpoint', 'a VPC to a service, by ENI', 'per-hour, per-AZ charge'],
            ['peering', 'two VPCs, one to one', 'not transitive; ranges must not overlap'],
            ['Transit Gateway', 'many VPCs, through a hub', 'routes between all of them'],
            ['Site-to-Site VPN', 'a site, over the internet', 'encrypted, quick to set up'],
            ['Direct Connect', 'a site, by a dedicated line', 'steady bandwidth; add encryption'],
          ],
        },
        {
          id: 'shop-uses',
          kind: 'list',
          icon: 'vpc',
          label: 'What the shop uses',
          pattern: 'network',
          items: [
            'An S3 gateway endpoint: catalog reads skip the NAT gateway and its per-GB charge',
            'Peering pcx-dev to the dev VPC: rt-app-a routes 10.30.0.0/16 there',
            'No VPN or Direct Connect: the shop has no office network to join',
          ],
        },
      ],
    },
  ],
  edges: [],
}
