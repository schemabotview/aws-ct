import type { TreeEntry } from '@graphlearning/flow'
import { projectTree } from '../project'

// shop-on-aws as Course 3 builds it, step by step. `fresh` marks what the section adds; `active` is
// the file in the editor.
const AT: Record<string, string[]> = {
  '04': ['catalog/p-1001.json', 'env.sh', 'requirements.txt'],
  '05': ['catalog/p-1001.json', 'env.sh', 'infra/01-bucket.sh', 'requirements.txt'],
  '06': ['catalog/p-1001.json', 'env.sh', 'infra/01-bucket.sh', 'infra/teardown.sh', 'requirements.txt', 'tools/cost_ledger.py'],
}

export const startTree = (step: keyof typeof AT, active: string, fresh: string[] = []): TreeEntry[] => projectTree(AT[step], active, fresh)
