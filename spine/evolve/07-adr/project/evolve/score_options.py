"""Score ADR-007's options: musts first, then weighted wants (1-5 each)."""
MUSTS = {"PostgreSQL transactions", "the team can run it"}
WANTS = {"no OS patching": 3, "cost at today's load": 2, "5x peak headroom": 2}

OPTIONS = {   # (musts met, scores for each want, in WANTS order)
    "EC2 + RDS": (MUSTS, (1, 5, 3)),
    "ECS Fargate + RDS": (MUSTS, (5, 3, 4)),
    "Lambda + DynamoDB": ({"the team can run it"}, (5, 4, 5)),
    "EKS + RDS": ({"PostgreSQL transactions"}, (3, 3, 5)),
}

ranked = []
for name, (met, scores) in OPTIONS.items():
    missing = MUSTS - met
    if missing:
        print(f"{name:<18} rejected, fails: {', '.join(sorted(missing))}")
        continue
    ranked.append((sum(w * s for w, s in zip(WANTS.values(), scores)), name))
for total, name in sorted(ranked, reverse=True):
    print(f"{name:<18} {total} of {5 * sum(WANTS.values())}")
