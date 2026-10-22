"""One month of app servers, bought three ways (HYPOTHETICAL USD rates)."""
ON_DEMAND, COMMITTED, SPOT = 0.04, 0.028, 0.016  # per m7g.large hour
DAYS = 30
FLEET = [  # what runs, servers, hours a day, how it is bought, rate
    ("baseline, all day", 3, 24, "1-year commitment", COMMITTED),
    ("evening peak", 3, 6, "on-demand", ON_DEMAND),
    ("image worker, nightly", 2, 4, "Spot", SPOT),
]
total = all_on_demand = 0.0
for what, servers, hours, bought, rate in FLEET:
    server_hours = servers * hours * DAYS
    cost = server_hours * rate
    total += cost
    all_on_demand += server_hours * ON_DEMAND
    print(f"{what:22} {server_hours:5} h  {bought:17} ${cost:7.2f}")
print(f"{'the month':22} {'':7}  {'':17} ${total:7.2f}")
print(f"{'all on-demand':22} {'':7}  {'':17} ${all_on_demand:7.2f}")
