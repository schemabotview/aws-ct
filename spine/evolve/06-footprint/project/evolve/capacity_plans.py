"""Four ways to provision the app servers for one day, in large-server hours
(a medium is half a large at half the price, assumed)."""
import math

DAY = [(8, 60), (10, 240), (6, 560)]       # (hours, req/s): night, day, evening
LARGE = 150                                # req/s one large server handles
work = sum(h * rate for h, rate in DAY) / LARGE   # large-hours of real work


def plan(size: float, az_safe: bool, fixed: bool = False) -> float:
    hours = 0.0
    for h, rate in DAY:
        rate = max(r for _, r in DAY) if fixed else rate
        need = math.ceil(rate / (LARGE * size))           # servers of this size
        if az_safe:                    # lose one AZ of three, still serve all
            need = 3 * math.ceil(need / 2)
        hours += h * need * size
    return hours


for name, hours in (("fixed, 4 large all day", plan(1, False, fixed=True)),
                    ("elastic, no reserve", plan(1, False)),
                    ("AZ-safe, large", plan(1, True)),
                    ("AZ-safe, medium", plan(0.5, True))):
    print(f"{name:<24} {hours:>5.0f} large-h/day  busy {work / hours:>4.0%}")
