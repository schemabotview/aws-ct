import type { Scene } from '@graphlearning/flow'

// §3.5 — the shop's security-group chain (internet → ALB 443 → app 8080 → DB 5432), each tier
// admitting only the group in front of it, and the SG-vs-NACL contrast. Security groups are stateful
// and allow-only, evaluated as a set on an ENI; network ACLs are stateless, allow and deny, evaluated
// in rule-number order per subnet — so a NACL must also allow return traffic on ephemeral ports.
// source: https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html
// source: https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html
export const trafficFilters: Scene = {
  id: 'traffic-filters',
  title: 'Security groups chain the tiers',
  flow: 'TB',
  padding: 0.05,
  nodes: [
    {
      id: 'chain',
      label: 'Inbound rules, tier by tier',
      pattern: 'group',
      cols: 3,
      children: [
        { id: 'sg-alb', label: 'sg-alb', sub: '443 from 0.0.0.0/0', pattern: 'network', icon: 'elb' },
        { id: 'sg-app', label: 'sg-app', sub: '8080 from sg-alb', pattern: 'service', icon: 'ec2' },
        { id: 'sg-db', label: 'sg-db', sub: '5432 from sg-app', pattern: 'storage', icon: 'rds' },
      ],
    },
    {
      id: 'rule',
      kind: 'code',
      filename: 'ec2.AuthorizeSecurityGroupIngress.request.json · model-checked',
      hug: true,
      label: `{
  "GroupId": "sg-app",
  "IpPermissions": [{
    "IpProtocol": "tcp",
    "FromPort": 8080,
    "ToPort": 8080,
    "UserIdGroupPairs": [{
      "GroupId": "sg-alb",
      "Description": "only the load balancer"
    }]
  }]
}`,
    },
    {
      id: 'sg-vs-nacl',
      kind: 'table',
      label: 'Security group vs network ACL',
      sub: 'both filter; they differ in every detail',
      headers: ['', 'security group', 'network ACL'],
      values: [
        ['attached to', 'a network interface', 'a subnet'],
        ['rules', 'allow only', 'allow and deny'],
        ['evaluation', 'all rules together', 'lowest number first'],
        ['return traffic', 'automatic (stateful)', 'needs a rule (stateless)'],
      ],
    },
  ],
  edges: [],
}
