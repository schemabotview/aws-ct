"""Walk workflows/place-order.asl.json as Step Functions would, with stand-in
tasks: Task, Retry (with backoff), Catch, Next/End and Fail -- nothing else."""
import json
import sys

ASL = json.load(open("workflows/place-order.asl.json"))
# What each function does for each order: errors in the order they are raised.
SCRIPT = {"o-501": {}, "o-507": {"charge-payment": ["Payment.Timeout",
                                                    "Payment.Timeout",
                                                    "Payment.Declined"]}}


def run(order: str) -> None:
    errors = {fn: list(raised) for fn, raised in SCRIPT[order].items()}
    name, t = ASL["StartAt"], 0.0
    while True:
        state = ASL["States"][name]
        if state["Type"] == "Fail":
            print(f"  {t:>4.0f}s {name}: FAILED {state['Error']}")
            return
        fn, attempt = state["Parameters"]["FunctionName"], 0
        while True:
            error = errors[fn].pop(0) if errors.get(fn) else None
            if error is None:
                print(f"  {t:>4.0f}s {name}: ok")
                nxt = state.get("Next")
                break
            rule = next((r for r in state.get("Retry", [])
                         if error in r["ErrorEquals"]), None)
            if rule and attempt < rule["MaxAttempts"]:
                wait = rule["IntervalSeconds"] * rule["BackoffRate"] ** attempt
                print(f"  {t:>4.0f}s {name}: {error}, retry in {wait:.0f}s")
                t, attempt = t + wait, attempt + 1
                continue
            catch = next(c for c in state["Catch"] if error in c["ErrorEquals"]
                         or "States.ALL" in c["ErrorEquals"])
            print(f"  {t:>4.0f}s {name}: {error}, caught -> {catch['Next']}")
            nxt = catch["Next"]
            break
        if nxt is None:
            print(f"  {t:>4.0f}s SUCCEEDED")
            return
        name = nxt


for order in sys.argv[1:]:
    print(order)
    run(order)
