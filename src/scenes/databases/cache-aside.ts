import type { Scene } from '@graphlearning/flow'

// §6.7 — cache-aside for product prices (as ElastiCache would hold them), and the stale-read window:
// with only a 60 s TTL, readers see the old price for up to a TTL after a write; deleting the key on
// write closes that window (racing readers can still refill a stale value — short TTLs bound it).
// source: https://docs.aws.amazon.com/AmazonElastiCache/latest/dg/Strategies.html
export const cacheAside: Scene = {
  id: 'cache-aside',
  title: 'How long can a cache lie?',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'cache',
      kind: 'code',
      filename: 'cache_aside.py · runs locally',
      hug: true,
      label: `TTL = 60  # seconds a cached price may live
db = {"p-1001": 12.0}
cache = {}  # key -> (value, expires_at)


def read(key, now):
    hit = cache.get(key)
    if hit and hit[1] > now:
        return hit[0], "hit"
    cache[key] = (db[key], now + TTL)  # cache-aside fill
    return db[key], "miss"


for invalidate in (False, True):
    cache.clear()
    db["p-1001"] = 12.0
    print("on write:", "delete cache key" if invalidate else "nothing")
    for t, event in [(0, "read"), (10, "write 10.0"),
                     (20, "read"), (59, "read"), (61, "read")]:
        if event == "read":
            value, how = read("p-1001", t)
            stale = "  STALE" if value != db["p-1001"] else ""
            print(f"  t={t:>2}s read {value} ({how}){stale}")
        else:
            db["p-1001"] = 10.0
            if invalidate:
                cache.pop("p-1001", None)
            print(f"  t={t:>2}s DB price -> 10.0")`,
    },
    {
      id: 'cache-out',
      kind: 'code',
      filename: 'output',
      hug: true,
      label: `on write: nothing
  t= 0s read 12.0 (miss)
  t=10s DB price -> 10.0
  t=20s read 12.0 (hit)  STALE
  t=59s read 12.0 (hit)  STALE
  t=61s read 10.0 (miss)
on write: delete cache key
  t= 0s read 12.0 (miss)
  t=10s DB price -> 10.0
  t=20s read 10.0 (miss)
  t=59s read 10.0 (hit)
  t=61s read 10.0 (hit)`,
    },
  ],
  edges: [],
}
