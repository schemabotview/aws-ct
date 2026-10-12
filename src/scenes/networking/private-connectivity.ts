import type { Scene } from '@graphlearning/flow'

// §3.9 — private paths. A gateway endpoint for S3 (route-table entry to the S3 prefix list; no
// endpoint charge) keeps the app servers' catalogue reads off the NAT gateway; its endpoint policy
// limits it to the shop's buckets. Peering is one-to-one and non-transitive; a transit gateway is a
// hub. Site-to-Site VPN is IPsec over the internet (two tunnels per connection); Direct Connect is a
// private link that is NOT encrypted by default (MACsec on supported links, or VPN over it).
// source: https://docs.aws.amazon.com/vpc/latest/privatelink/vpce-gateway.html
// source: https://docs.aws.amazon.com/vpc/latest/peering/vpc-peering-basics.html
// source: https://docs.aws.amazon.com/directconnect/latest/UserGuide/encryption-in-transit.html
export const privateConnectivity: Scene = {
  id: 'private-connectivity',
  title: 'Private paths out of the VPC',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'endpoint-policy',
      kind: 'code',
      filename: 's3-endpoint-policy.json · model-checked',
      hug: true,
      label: `{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "ShopBucketsOnly",
    "Effect": "Allow",
    "Principal": "*",
    "Action": ["s3:GetObject", "s3:PutObject"],
    "Resource": "arn:aws:s3:::shop-*-111122223333/*"
  }]
}`,
    },
    {
      id: 'options',
      kind: 'table',
      label: 'Choosing a private path',
      sub: 'what each connects, and what to remember',
      headers: ['option', 'connects', 'remember'],
      values: [
        ['gateway endpoint', 'VPC → S3, DynamoDB', 'a route; no endpoint fee'],
        ['interface endpoint', 'VPC → a service', 'an ENI; hourly fee'],
        ['VPC peering', 'VPC ↔ one VPC', 'not transitive'],
        ['transit gateway', 'many VPCs, a hub', 'routes per attachment'],
        ['Site-to-Site VPN', 'office ↔ VPC', 'IPsec over the internet'],
        ['Direct Connect', 'office ↔ AWS', 'private, not encrypted'],
      ],
    },
  ],
  edges: [],
}
