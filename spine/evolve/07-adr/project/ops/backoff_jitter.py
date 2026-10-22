"""100 clients throttled at once, retrying against a service that accepts
200 calls a second (2 per 10 ms). A model: how long until all are served?"""
import random

CLIENTS, CAPACITY, SLOT, BASE = 100, 2, 0.01, 0.1      # seconds


def run(jitter: bool, seed: int = 7) -> tuple[float, int, int]:
    rng = random.Random(seed)
    due = {c: 0.0 for c in range(CLIENTS)}   # client -> next attempt time
    tries = {c: 0 for c in range(CLIENTS)}
    t, peak, calls = 0.0, 0, 0
    while due:
        now = [c for c, at in due.items() if at < t + SLOT]
        calls += len(now)
        peak = max(peak, len(now)) if t > 0 else 0   # retries only
        for c in now[:CAPACITY]:             # served this slot
            del due[c]
        for c in now[CAPACITY:]:             # throttled: back off and retry
            tries[c] += 1
            cap = min(20.0, BASE * 2 ** tries[c])
            due[c] = t + (rng.uniform(0, cap) if jitter else cap)
        t += SLOT
    return t, peak, calls


for name, jitter in (("no jitter", False), ("full jitter", True)):
    took, peak, calls = run(jitter)
    print(f"{name:<12} done in {took:3.1f} s, {calls} calls,"
          f" worst retry slot {peak}")
