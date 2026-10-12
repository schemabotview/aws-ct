import type { Scene } from '@graphlearning/flow'

// §3.1 — the production VPC's address plan, computed rather than asserted: 10.20.0.0/16 split into
// nine /24 subnets (public 0–2, app 10–12, data 20–22 for AZs a–c). AWS reserves five addresses in
// every subnet (the first four and the last), so a /24 has 251 usable.
// source: https://docs.aws.amazon.com/vpc/latest/userguide/subnet-sizing.html
export const cidrPlan: Scene = {
  id: 'cidr-plan',
  title: 'An address plan, checked by code',
  flow: 'TB',
  padding: 0.05,
  nodes: [
    {
      id: 'plan',
      kind: 'code',
      filename: 'cidr_plan.py · runs locally',
      hug: true,
      label: `import ipaddress as ip

vpc = ip.ip_network("10.20.0.0/16")
print("VPC", vpc, "=", vpc.num_addresses, "addresses")

tiers = {"public": 0, "app": 10, "data": 20}
plan = {}
for tier, base in tiers.items():
    for i, az in enumerate("abc"):
        net = ip.ip_network(f"10.20.{base + i}.0/24")
        assert net.subnet_of(vpc)
        plan[f"{tier}-{az}"] = net

size = plan["app-b"].num_addresses
print("each /24:", size, "-> usable", size - 5)

host = ip.ip_address("10.20.11.37")
print(host, "is in", [n for n, s in plan.items() if host in s])
nets = list(plan.values())
clash = any(a.overlaps(b) for a in nets for b in nets if a is not b)
print("9 subnets, overlaps:", clash)`,
    },
    {
      id: 'plan-out',
      kind: 'code',
      filename: 'output',
      hug: true,
      label: `VPC 10.20.0.0/16 = 65536 addresses
each /24: 256 -> usable 251
10.20.11.37 is in ['app-b']
9 subnets, overlaps: False`,
    },
    {
      id: 'ports',
      kind: 'table',
      label: 'Ports on the shop’s request path',
      sub: 'protocol / port → what listens',
      headers: ['port', 'protocol', 'used by'],
      values: [
        ['443', 'TCP', 'HTTPS to the load balancer'],
        ['8080', 'TCP', 'load balancer → app server'],
        ['5432', 'TCP', 'app server → PostgreSQL'],
        ['53', 'UDP / TCP', 'DNS lookups'],
      ],
    },
  ],
  edges: [{ source: 'plan', target: 'plan-out', label: 'python3 cidr_plan.py' }],
}
