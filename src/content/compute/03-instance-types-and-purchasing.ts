import type { Section } from '../types'

export const instanceTypesAndPurchasing: Section = {
  id: 'instance-types-and-purchasing',
  title: 'CPU, memory, architecture, instance families, and purchase-model trade-offs',
  scene: 'purchase-options',
  focus: 'mix-out',
  slide: `## Instance types and purchasing

**Objective:** read a type name, and match capacity to a way of paying.

### Mental model
- **m7g.large**: general purpose, 7th gen, **Graviton (Arm64)**, 2 vCPU, 8 GiB
- Arm needs **arm64 builds** of your code and images
- **On-demand**, **commitments**, **Spot** price the same capacity differently

### Worked example: one month
- Hypothetical rates · baseline 3 × 24 h, committed: **$60.48**
- Evening peak +3 for 6 h → on-demand: **$21.60**
- Image worker on Spot: **$3.84** → **$85.92** vs **$117.60**

### Misconception
- "Spot is free money" — it can be reclaimed with two minutes' notice

### Explanation summary
- Commit the floor, buy the peak, put interruptible work on Spot`,
  narration:
    "An instance type name is a compact specification. Read m seven g large from the left. M is the general purpose family, balanced between C P U and memory; C would lean to compute, R to memory. Seven is the generation. G means a Graviton processor, which is Arm sixty four, so our code and our container images must be built for that architecture. Large is the size: two virtual C P Us and eight gibibytes of memory. Then comes a separate decision: how to pay for the capacity. The program prices one month of the order platform with the course's hypothetical rates, so treat them as placeholders. Three servers, one per zone, run all day, every day. That is a floor we are sure of, so it gets a one year commitment at thirty percent off: two thousand one hundred and sixty hours, sixty dollars forty eight. The evening peak adds three servers for six hours a day; that is less certain, so it stays on demand: twenty one dollars sixty. The product image worker can be interrupted and resumed, so it runs on Spot, spare capacity at a deep discount: three dollars eighty four. The mix comes to eighty five dollars ninety two, against one hundred and seventeen sixty if everything were on demand. The misconception is that Spot is free money. A W S can reclaim a Spot instance with a best effort two minute notice, so only work that tolerates interruption belongs there. Commit the floor, buy the peak on demand, and put interruptible work on Spot.",
}
