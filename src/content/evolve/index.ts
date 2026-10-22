import type { Course } from '../types'
import { measuringBeforeTuning } from './01-measuring-before-tuning'
import { cloudfrontAndCaching } from './02-cloudfront-and-caching'
import { rightsizingAndIdleCapacity } from './03-rightsizing-and-idle-capacity'
import { costAllocationAndBudgets } from './04-cost-allocation-and-budgets'
import { theMonthsBill } from './05-the-months-bill'
import { sustainabilityTradeOffs } from './06-sustainability-trade-offs'
import { requirementsAndADecisionRecord } from './07-requirements-and-a-decision-record'
import { threeWaysToRunTheShop } from './08-three-ways-to-run-the-shop'
import { oneRegionOrMore } from './09-one-region-or-more'
import { migrationAndCutover } from './10-migration-and-cutover'
import { aWellArchitectedReview } from './11-a-well-architected-review'

// Course 13 — Measure, tune and evolve it. Saturation; CloudFront; rightsizing; cost allocation,
// budgets and the month's bill (hypothetical rates); sustainability proxies; ADR-007; three
// platforms; one Region or more; a weighted cutover with gates; a Well-Architected review.
export const evolve: Course = {
  id: 'evolve',
  title: 'Measure, tune and evolve it',
  sections: [measuringBeforeTuning, cloudfrontAndCaching, rightsizingAndIdleCapacity, costAllocationAndBudgets, theMonthsBill, sustainabilityTradeOffs, requirementsAndADecisionRecord, threeWaysToRunTheShop, oneRegionOrMore, migrationAndCutover, aWellArchitectedReview],
}
