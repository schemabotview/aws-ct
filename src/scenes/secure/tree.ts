import type { TreeEntry } from '@graphlearning/flow'
import { projectTree } from '../project'

// shop-on-aws through Course 4: Course 3's files, then the policies and scripts each step adds.
const COURSE_3 = ['catalog/p-1001.json', 'env.sh', 'infra/01-bucket.sh', 'infra/teardown.sh', 'requirements.txt', 'tools/cost_ledger.py']
const ADDS: [string, string[]][] = [
  ['03', ['policies/order-api-trust.json', 'infra/04-roles.sh']],
  ['05', ['policies/order-api-access.json']],
  ['06', ['tools/probe.py']],
  ['07', ['policies/reports-bucket.json', 'policies/auditor-reads.json']],
  ['08', ['policies/scp-regions.json', 'infra/04-guardrails.sh']],
]

export function secureTree(step: string, active: string, fresh: string[] = []): TreeEntry[] {
  const files = [...COURSE_3, ...ADDS.filter(([s]) => s <= step).flatMap(([, f]) => f)]
  return projectTree(files, active, fresh)
}
