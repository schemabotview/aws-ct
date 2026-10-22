"""300 shoppers fill carts behind a round-robin load balancer; then app-2 is
removed by a scale-in. Where the carts live decides what is lost."""
SERVERS = ["app-1", "app-2", "app-3"]


def shop(store_on_server):
    local = {s: set() for s in SERVERS}  # each server's own disk
    shared = set()  # one store all servers use
    for n in range(300):
        server = SERVERS[n % len(SERVERS)]  # round robin
        (local[server] if store_on_server else shared).add(f"cart-{n}")
    del local["app-2"]  # scale-in terminates app-2, and its disk
    return sum(len(c) for c in local.values()) + len(shared)


for where, on_server in (("on each server's disk", True),
                         ("in a shared store", False)):
    kept = shop(on_server)
    print(f"carts {where:22} kept {kept}, lost {300 - kept}")
