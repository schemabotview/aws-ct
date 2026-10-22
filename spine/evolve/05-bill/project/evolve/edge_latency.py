"""A Sydney shopper loads the p-1001 page. A model, with assumed round trips:
280 ms to London, 12 ms to the Sydney edge; the origin takes 112 ms."""
RTT_ORIGIN, RTT_EDGE, ORIGIN_MS = 280, 12, 112
SETUP = 2            # TCP + TLS 1.3 handshakes, then 1 round trip to ask

direct = (SETUP + 1) * RTT_ORIGIN + ORIGIN_MS
hit = (SETUP + 1) * RTT_EDGE + 2                    # served from the edge
miss = (SETUP + 1) * RTT_EDGE + RTT_ORIGIN + ORIGIN_MS   # edge asks London
for name, ms in (("direct to London", direct), ("edge, cache hit", hit),
                 ("edge, cache miss", miss)):
    print(f"{name:<18} {ms:>4} ms")
print(f"{'90% hits, average':<18} {0.9 * hit + 0.1 * miss:>4.0f} ms")
