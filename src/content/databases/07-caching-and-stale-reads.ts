import type { Section } from '../types'

export const cachingAndStaleReads: Section = {
  id: 'caching-and-stale-reads',
  title: 'ElastiCache, cache-aside flows, expiry, invalidation, and stale reads',
  scene: 'cache-aside',
  focus: 'cache-out',
  slide: `## Cache-aside and stale reads

**Objective:** say how stale a cached answer can be.

### Mental model
- **Cache-aside**: read cache; on a miss, read DB and fill
- A **miss** costs a database read plus a cache fill
- **TTL** bounds how long a copy lives
- **Invalidate** on write to shorten the stale window

### Worked example: p-1001's price
- TTL 60 s, nothing on write: **stale from 10 s to 60 s**
- Delete the key on write: the next read is a **miss**, fresh
- A racing reader can still refill an old value — keep TTLs short

### Misconception
- "A cache is just faster" — it is a second copy that can be wrong

### Explanation summary
- Choose staleness on purpose; bound it with TTL`,
  narration:
    "Four hundred and fifty product reads a second do not all need to reach the database. A cache such as ElastiCache, holding copies in memory, can answer most of them. The common pattern is cache aside. The application reads the cache first. On a hit, it uses the copy. On a miss, it reads the database and fills the cache, with a time to live, a T T L, after which the copy expires. The program plays the price of product p one thousand and one through two timelines, with a sixty second T T L. In the first, nothing happens to the cache on a write. At zero seconds a read misses and caches twelve. At ten seconds the price in the database drops to ten. At twenty and at fifty nine seconds, readers still get twelve from the cache: stale. Only at sixty one seconds, after expiry, does a read fetch ten. For almost fifty seconds, shoppers saw the wrong price. In the second timeline, the write also deletes the cache key, so the next read misses and fetches the new price. That closes the window, but not perfectly: a reader that fetched the old value just before the write can put it back into the cache just after. Short T T Ls bound that case. The misconception is that a cache is just a faster database. It is a second copy of the data, and copies can be wrong. So decide how much staleness each kind of data can tolerate, invalidate on write where it matters, and always bound the rest with a T T L.",
}
