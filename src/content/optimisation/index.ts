import type { Course } from '../types'
import { measurementAndSaturation } from './01-measurement-and-saturation'
import { cloudfrontAndCaching } from './02-cloudfront-and-caching'
import { rightsizingAndIdleCapacity } from './03-rightsizing-and-idle-capacity'
import { costAllocationAndBudgets } from './04-cost-allocation-and-budgets'
import { totalCostTradeOffs } from './05-total-cost-trade-offs'
import { sustainabilityTradeOffs } from './06-sustainability-trade-offs'

// Chapter 11 — Performance, Cost, and Sustainability
//
// Objective: Evaluate optimisation choices against workload evidence and explicit economic assumptions.
//
// Worked illustrations: a latency breakdown before/after edge caching (§2, assumed RTTs, runs locally);
// cache-key and invalidation contrasts (§2); a resource-utilisation graph (§3 plot + four capacity
// plans); a monthly cost calculation with labelled hypothetical rates and assumed volumes, including
// cross-AZ and internet transfer, NAT hourly and processing, logs, backups and idle capacity (§5, §3).
// On-demand vs commitments vs Spot without treating discounts as guaranteed savings (§5: 70% break-even).
// Sustainability decisions with explicit constraints; lower price is not lower carbon (§6).
//
// Outcome: Identify a measured bottleneck or cost driver, construct an assumption-based comparison, and
// explain the correctness, reliability, and operational consequences of an optimisation.
//
// Bridge: Individual optimisations must fit the whole workload; next we integrate requirements and
// evidence into architectural decisions. (Spoken as the last line of §6's narration.)
export const optimisation: Course = {
  id: 'optimisation',
  title: 'Performance, Cost, and Sustainability',
  sections: [
    measurementAndSaturation,
    cloudfrontAndCaching,
    rightsizingAndIdleCapacity,
    costAllocationAndBudgets,
    totalCostTradeOffs,
    sustainabilityTradeOffs,
  ],
}
