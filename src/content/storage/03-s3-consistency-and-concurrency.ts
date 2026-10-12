import type { Section } from '../types'

export const s3ConsistencyAndConcurrency: Section = {
  id: 's3-consistency-and-concurrency',
  title: 'S3 consistency, concurrent updates, and the boundary of single-object operations',
  scene: 'concurrent-writers',
  focus: 'race-out',
  slide: `## Consistency and concurrent writers

**Objective:** what S3 guarantees when writers collide.

### Mental model
- **Strong consistency:** reads see completed writes
- Concurrent PUTs to one key: **last writer wins**
- **Conditional writes** (If-Match) detect the race
- **Per object**: no multi-object transaction

### Worked example: p-1001.json, emulated
- Two jobs read the same version
- Plain PUT: price **12.0** — a change lost
- If-Match: **PreconditionFailed**, re-read → **10.0, 39**

### Misconception
- "Consistent = safe to share" — reads yes, races no

### Explanation summary
- Use conditional writes; never assume multi-key atomicity`,
  narration:
    "S three is strongly consistent: once a write has succeeded, every later read and every listing sees it. That is a promise about reading. It is not a promise about two writers. Here is the case the plan asks for, run in an emulator. A pricing job and a stock job both read product p one thousand and one's file, at the same version. The pricing job lowers the price to ten; the stock job reduces stock to thirty nine. Both write the whole object back. With plain puts, S three applies them in order and the last writer wins. Look at the first output line: the price is back at twelve. The price change was silently lost, and no error was raised anywhere. Now the same race with conditional writes. Each job sends If Match with the E Tag it read. The pricing job's write matches and succeeds. The stock job's write no longer matches, because the object changed, so S three refuses it with Precondition Failed. The stock job re-reads, re-applies its change and writes again. The final object has both changes: price ten, stock thirty nine. If None Match, with a star, is the companion: create this key only if it does not exist yet. One boundary remains. All of this is per object. If an update must change p one thousand and one's file and the catalogue index together, S three has no transaction across the two keys; a reader can see one without the other. The misconception is that strong consistency makes shared writing safe. It makes reads safe. Use conditional writes for races, and never assume atomicity across keys.",
}
