import type { Scene } from '@graphlearning/flow'

// §3.4 — the plan's failure case: the order API in a private subnet cannot reach the payment
// provider's API (api.payments.example.com → 198.51.100.7) because its route table has only the
// `local` route. The fix is a public NAT gateway in public-a (it needs an Elastic IP; NAT gateways are
// zonal by default, so one per AZ keeps each AZ's egress independent) and a default route to it.
// source: https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateNatGateway.html
// source: https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html
export const privateEgress: Scene = {
  id: 'private-egress',
  title: 'A private app that cannot reach an external API',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'symptom',
      kind: 'code',
      filename: 'symptom.txt · illustrative',
      hug: true,
      label: `app-a$ curl -m 5 https://api.payments.example.com/v1/ping
curl: (28) Connection timed out after 5001 milliseconds
# route table rt-app-a: 10.20.0.0/16 -> local, nothing else`,
    },
    {
      id: 'fix',
      kind: 'code',
      filename: 'nat-egress.sh · model-checked',
      hug: true,
      label: `aws ec2 allocate-address --domain vpc
aws ec2 create-nat-gateway --subnet-id subnet-public-a \\
  --allocation-id eipalloc-0a1b2c --connectivity-type public
aws ec2 create-route --route-table-id rtb-app-a \\
  --destination-cidr-block 0.0.0.0/0 --nat-gateway-id nat-a`,
    },
    {
      id: 'reachability',
      kind: 'table',
      label: 'Who can start a connection?',
      sub: 'IPv4, security groups allowing the traffic',
      headers: ['where the server sits', 'outbound', 'inbound from internet'],
      values: [
        ['public subnet + public IP', 'yes, via IGW', 'yes'],
        ['public subnet, no public IP', 'no', 'no'],
        ['private subnet, no NAT route', 'no', 'no'],
        ['private subnet + NAT route', 'yes, as NAT EIP', 'no'],
      ],
    },
  ],
  edges: [
    { source: 'symptom', target: 'fix', label: 'add a NAT route' },
    { source: 'fix', target: 'reachability', label: 'the general rule' },
  ],
}
