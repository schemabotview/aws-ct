"""Cache-aside for the product page: what readers see after a price drop."""
DB = {"p-1001": 12.0}
TTL = 60          # seconds an entry may live in the cache
READS = (0, 20, 40, 61)


def run(invalidate: bool) -> list[str]:
    cache: dict[str, tuple[float, int]] = {}  # key -> (price, expires at)

    def read(t: int) -> str:
        hit = cache.get("p-1001")
        if hit and hit[1] > t:
            return f"{hit[0]} {'stale' if hit[0] != DB['p-1001'] else 'hit'}"
        cache["p-1001"] = (DB["p-1001"], t + TTL)  # miss: load, keep a copy
        return f"{DB['p-1001']} miss"

    def write(price: float) -> None:
        DB["p-1001"] = price
        if invalidate:
            cache.pop("p-1001", None)  # delete-on-write: next read reloads

    DB["p-1001"] = 12.0
    seen = [read(0)]
    write(10.0)                        # at t=10 the price drops to 10.0
    return seen + [read(t) for t in READS[1:]]


print(f"{'':<16}" + "".join(f"{f't={t}':<12}" for t in READS).rstrip())
for name, flag in (("TTL only", False), ("delete-on-write", True)):
    print(f"{name:<16}" + "".join(f"{s:<12}" for s in run(flag)).rstrip())
