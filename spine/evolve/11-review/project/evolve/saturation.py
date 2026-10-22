"""One app server as a queue: 15 workers, ~100 ms of work per request.
A simulation, not AWS: latency as the arrival rate climbs."""
import heapq
import random

WORKERS, SERVICE_S, REQUESTS = 15, 0.100, 60_000


def latencies(rate: float, seed: int = 12) -> list[float]:
    rng = random.Random(seed)
    free = [0.0] * WORKERS                 # when each worker is next free
    t, took = 0.0, []
    for _ in range(REQUESTS):
        t += rng.expovariate(rate)         # the next request arrives
        start = max(t, heapq.heappop(free))   # it waits for a free worker
        done = start + rng.gammavariate(4, SERVICE_S / 4)
        heapq.heappush(free, done)
        took.append((done - t) * 1000)
    return sorted(took)


capacity = WORKERS / SERVICE_S             # 150 req/s, if never idle
for rate in (60, 120, 140, 147):
    ms = latencies(rate)
    p50, p99 = ms[len(ms) // 2], ms[int(len(ms) * 0.99)]
    print(f"{rate:>3} req/s  busy {rate / capacity:>4.0%}"
          f"  p50 {p50:>4.0f} ms  p99 {p99:>5.0f} ms")
