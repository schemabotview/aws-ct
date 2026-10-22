"""The gate at each traffic step: every order the new path acknowledged
must be in the orders database. Counts are the cutover's log for 100%."""
STEPS = [("90/10", 121, 121), ("50/50", 604, 604), ("0/100", 1210, 1207)]

for weights, acked, stored in STEPS:
    if acked == stored:
        print(f"{weights:<6} acked {acked:>5}, stored {stored:>5}: pass")
        continue
    print(f"{weights:<6} acked {acked:>5}, stored {stored:>5}:"
          f" {acked - stored} missing -> roll back to 50/50")
    print(f"       replay the {acked - stored} from the queue, then retry")
    break
