import type { Section } from '../types'

export const regionalChoices: Section = {
  id: 'regional-choices',
  title: 'Single-Region, multi-AZ, and multi-Region choices and data consequences',
  scene: 'region-choices',
  focus: 'failure-out',
  slide: `## One Region or two

**Objective:** see what a second Region costs in data.

### Mental model
- **Multi-AZ**: synchronous copies, one Region, RPO 0
- **Multi-Region**: asynchronous copies, some writes in flight
- **Active/active**: writes in both — conflicts need a rule

### Worked example: London fails (assumed 2 s lag)
- Active/passive: ~12 acked orders missing in eu-west-1
- Health check 3 × 30 s + TTL 60 s: up to 150 s
- Active/active: both Regions sell the last p-1002
- 2 sold, 1 existed: one order cannot ship

### Misconception
- "Two Regions, twice as reliable" — new failure modes

### Explanation summary
- Add a Region only for a need one Region cannot meet`,
  narration:
    "The shop runs in one Region across three Availability Zones. Within a Region, Multi-AZ databases copy synchronously, so a zone failure loses no committed data. Between Regions the distance makes copies asynchronous, so some acknowledged writes are always in flight. And if both Regions accept writes, active active, two of them can conflict, which needs a rule to decide. The program works through a regional failure of London with an assumed replication lag of two seconds. In an active passive design, about twelve acknowledged orders, at six a second, have not reached E U west one when it takes over. Moving traffic is not instant either: a Route fifty three health check needs three failures thirty seconds apart, and resolvers may keep the old answer for a sixty second T T L, so up to a hundred and fifty seconds, and only if the standby Region is ready to serve. Active active avoids that wait but meets the conflict problem. Product p-1002 has one unit left. Both Regions sell it locally, each sees its stock fall to zero, and after replication two have been sold where one existed: one order cannot ship. DynamoDB global tables, for example, resolve conflicts with last writer wins, which keeps the data consistent but cannot undo the second sale. The table summarises the steps: one zone survives instance failure with one copy; multi-AZ survives a zone with a synchronous standby; two Regions active passive survive a Region but lose recent writes; active active survives faster but needs a conflict rule. The misconception is that two Regions are twice as reliable. They add replication, failover and conflict failure modes, and cost. So: add a Region only for a requirement that one Region cannot meet.",
}
