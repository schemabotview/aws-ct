"""Last month's restore drill, timed, against the objectives it must meet.
The times are the drill's log; the check is the point."""
RTO_MIN, RPO_MIN = 90, 15            # recover within 90 min, lose <= 15 min

DRILL = [("02:00", "start: restore shop-orders from the 01:52 point"),
         ("02:41", "new instance available"),
         ("02:52", "app pointed at it, smoke tests pass"),
         ("03:06", "order counts match the last export: done")]


def minutes(hhmm: str) -> int:
    h, m = hhmm.split(":")
    return int(h) * 60 + int(m)


for at, step in DRILL:
    print(f"{at}  {step}")
took = minutes(DRILL[-1][0]) - minutes(DRILL[0][0])
lost = minutes("02:00") - minutes("01:52")    # failure at 02:00, data to 01:52
for name, value, limit in (("RTO", took, RTO_MIN), ("RPO", lost, RPO_MIN)):
    verdict = "met" if value <= limit else "MISSED"
    print(f"{name}: {value} min against {limit}: {verdict}")
