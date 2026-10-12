import type { Scene } from '@graphlearning/flow'

// §3.6 — resolving shop.example.com: a recursive resolver walks root → .com → the example.com zone's
// authoritative servers (a Route 53 public hosted zone), whose alias A record points at the load
// balancer. The alias target's HostedZoneId is the LOAD BALANCER's canonical hosted zone id (from
// describe-load-balancers); the ids shown are placeholders.
// source: https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/resource-record-sets-choosing-alias-non-alias.html
// source: https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/routing-policy.html
export const dnsResolution: Scene = {
  id: 'dns-resolution',
  title: 'From a name to the load balancer',
  cols: 2,
  padding: 0.12,
  nodes: [
    {
      id: 'chain',
      label: 'Resolving shop.example.com',
      pattern: 'group',
      flow: 'TB',
      children: [
        { id: 'browser', label: 'Browser', sub: 'asks its resolver', pattern: 'user', icon: 'globe' },
        { id: 'resolver', label: 'Recursive resolver', sub: 'caches for the TTL', pattern: 'network', icon: 'search' },
        { id: 'zone', label: 'example.com zone', sub: 'Route 53, authoritative', pattern: 'service', icon: 'route53' },
        { id: 'alb', label: 'Load balancer', sub: 'alias target', pattern: 'network', icon: 'elb' },
      ],
      edges: [
        { source: 'browser', target: 'resolver' },
        { source: 'resolver', target: 'zone', label: 'via root, .com' },
        { source: 'zone', target: 'alb', label: 'alias A' },
      ],
    },
    {
      id: 'record',
      kind: 'code',
      filename: 'route53.ChangeResourceRecordSets.request.json · model-checked',
      hug: true,
      label: `{
  "HostedZoneId": "Z0SHOPZONEEXAMPLE",
  "ChangeBatch": {
    "Changes": [{
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "shop.example.com",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z0ALBZONEEXAMPLE",
          "DNSName":
            "shop-alb-123.eu-west-2.elb.amazonaws.com",
          "EvaluateTargetHealth": true
        }
      }
    }]
  }
}`,
    },
    {
      id: 'policies',
      kind: 'list',
      framed: true,
      label: 'Routing policies: which answer?',
      icon: 'route53',
      pattern: 'network',
      items: [
        'simple — one answer',
        'weighted — split by weight, e.g. 90 / 10',
        'latency — the lowest-latency Region',
        'failover — primary, else secondary',
        'geolocation — by the user’s location',
      ],
    },
  ],
  edges: [],
}
