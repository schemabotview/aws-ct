import type { Section } from '../types'

export const routeTables: Section = {
  id: 'route-tables',
  title: 'Route tables',
  scene: 'route-selection',
  narration:
    "A route table decides where a packet leaving a subnet goes next. In the terminal, infra zero five routes creates an internet gateway, igw shop, attaches it to the V P C, and creates a route table, r t public. That table gets a route for zero dot zero dot zero dot zero slash zero, which means every address, pointing at the internet gateway, and it is associated with the three public subnets. The script prints the table's I D and its routes: local, and the default route via the gateway. The table below lists them. The local route, for the whole V P C range, is in every route table, and cannot be removed. Then two questions, asked by a small tool, route pick, which reads the real route table from the emulator and picks a route the way the V P C router does. From public a to ten dot twenty dot eleven dot thirty seven, the app server: two routes contain that address, the local slash sixteen and the default slash zero, and the longest prefix wins, so the packet stays local. From public a to one nine eight dot fifty one dot one hundred dot seven, the payments provider: only the default route contains it, so it leaves through the internet gateway. The list states the rule and one common confusion. Every route that contains the destination is a candidate, and the most specific, the longest prefix, wins. The local route always exists. And a public subnet is public only because its route table reaches an internet gateway; a server in it still needs a public address and an open security group before anyone can reach it. Next, the app subnets, which have no route out at all yet.",
}
