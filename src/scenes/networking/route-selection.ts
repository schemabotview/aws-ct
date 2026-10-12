import type { Scene } from '@graphlearning/flow'

// §3.3 — route selection: the app subnets' route table and the longest-prefix-match rule, run on
// three destinations. The VPC's own range is always the `local` route. The public subnets' table
// differs only in its default route (0.0.0.0/0 → the internet gateway). pcx-dev is the peering to the
// dev VPC (10.30.0.0/16) introduced in §9; nat-a is §4's NAT gateway.
// source: https://docs.aws.amazon.com/vpc/latest/userguide/how-route-tables-work.html
export const routeSelection: Scene = {
  id: 'route-selection',
  title: 'The most specific route wins',
  flow: 'TB',
  padding: 0.05,
  nodes: [
    {
      id: 'tables',
      label: 'Route tables',
      pattern: 'group',
      cols: 2,
      children: [
        {
          id: 'rt-public',
          kind: 'table',
          label: 'rt-public',
          sub: 'public-a, b, c',
          headers: ['destination', 'target'],
          values: [
            ['10.20.0.0/16', 'local'],
            ['0.0.0.0/0', 'igw-shop'],
          ],
        },
        {
          id: 'rt-app',
          kind: 'table',
          label: 'rt-app-a',
          sub: 'app-a',
          headers: ['destination', 'target'],
          values: [
            ['10.20.0.0/16', 'local'],
            ['10.30.0.0/16', 'pcx-dev'],
            ['0.0.0.0/0', 'nat-a'],
          ],
        },
      ],
    },
    {
      id: 'run',
      label: 'rt-app-a, applied by code',
      pattern: 'group',
      cols: 2,
      children: [
        {
          id: 'lpm',
          kind: 'code',
          filename: 'route_pick.py · runs locally',
          hug: true,
          label: `import ipaddress as ip

routes = [  # the app subnets' route table
    ("10.20.0.0/16", "local"),
    ("10.30.0.0/16", "pcx-dev"),
    ("0.0.0.0/0", "nat-a"),
]


def pick(dest):
    d = ip.ip_address(dest)
    hits = [(ip.ip_network(c), t) for c, t in routes
            if d in ip.ip_network(c)]
    # the most specific (longest prefix) match wins
    return max(hits, key=lambda h: h[0].prefixlen)


for dest in ["10.20.20.15", "10.30.4.9", "198.51.100.7"]:
    net, target = pick(dest)
    print(f"{dest:<13} -> {target:<8} via {net}")`,
        },
        {
          id: 'lpm-out',
          kind: 'code',
          filename: 'output',
          hug: true,
          label: `10.20.20.15   -> local    via 10.20.0.0/16
10.30.4.9     -> pcx-dev  via 10.30.0.0/16
198.51.100.7  -> nat-a    via 0.0.0.0/0`,
        },
      ],
    },
  ],
  edges: [{ source: 'tables', target: 'run', label: 'longest prefix' }],
}
