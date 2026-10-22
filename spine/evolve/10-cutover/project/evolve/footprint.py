"""Three levers on the shop's footprint, each under a constraint it must keep.
Proxies, not carbon: server-hours, gigabytes kept, gigabytes moved."""
servers = {"AZ-safe large": 90, "AZ-safe medium": 78}       # large-h/day, §3
print(f"servers: {servers['AZ-safe large']} -> {servers['AZ-safe medium']}"
      " large-h/day, still surviving an AZ")

LOGS_GB_DAY = 2
forever = LOGS_GB_DAY * 365                 # never deleted: a year's worth
kept_30d = LOGS_GB_DAY * 30                 # retention 30 days
print(f"logs:    {forever} -> {kept_30d} GB stored after a year,"
      " 30 days kept for incidents")

ORIGIN_GB = 900                             # product pages leaving London
hit_rate = 0.90                             # §2: 90% served at the edge
print(f"origin:  {ORIGIN_GB} -> {ORIGIN_GB * (1 - hit_rate):.0f} GB a month"
      " from London, pages at most 60 s old")
