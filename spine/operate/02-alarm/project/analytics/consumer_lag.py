"""The evening's clicks against one consumer: how far behind it falls.
A model: 1,800 clicks/s from 18:00 to 20:00, then 600/s; it reads 1,600/s."""
from collections import deque

CONSUME = 1600 * 60                      # records a minute, steady
waiting: deque = deque()                 # [minute written, records left]
for minute in range(18 * 60, 21 * 60):
    waiting.append([minute, (1800 if minute < 20 * 60 else 600) * 60])
    budget = CONSUME
    while waiting and budget:            # read the oldest records first
        take = min(budget, waiting[0][1])
        waiting[0][1] -= take
        budget -= take
        if waiting[0][1] == 0:
            waiting.popleft()
    now = minute + 1
    if now % 30 == 0 or not waiting:
        backlog = sum(n for _, n in waiting)
        age = now - waiting[0][0] if waiting else 0   # IteratorAge, minutes
        print(f"{now // 60:02d}:{now % 60:02d}  backlog {backlog:>9,}"
              f"  iterator age {age:>2} min")
        if not waiting:
            break
