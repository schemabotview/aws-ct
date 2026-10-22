"""The evening surge, minute by minute: reacting to it, or expecting it.

A model, not AWS: a server serves 150 req/s and needs 5 minutes from launch
to in service; demand steps from 240 to 560 req/s at 18:00.
"""
import math

PER_SERVER, WARMUP, SURGE = 150, 5, 18 * 60


def evening(scheduled):
    in_service, arriving, short = 3, {}, {}
    for minute in range(17 * 60 + 40, 18 * 60 + 15):
        in_service += arriving.pop(minute, 0)
        demand = 560 if minute >= SURGE else 240
        wanted = math.ceil(demand / PER_SERVER)
        if scheduled and minute == 17 * 60 + 45:
            wanted = 6  # evening-peak raises the minimum to 6
        if wanted > in_service + sum(arriving.values()):
            arriving[minute + WARMUP] = wanted - in_service
        if demand > in_service * PER_SERVER:
            short[minute] = demand - in_service * PER_SERVER
    return short


for name, scheduled in (("reactive only", False), ("evening-peak", True)):
    short = evening(scheduled)
    if short:
        first, last = min(short), max(short)
        print(f"{name:14} short {max(short.values())} req/s, "
              f"{first // 60}:{first % 60:02} to {last // 60}:{last % 60:02}")
    else:
        print(f"{name:14} never short: 6 in service before 18:00")
