"""London goes dark at 18:40. What a second Region costs in data and time.
Assumed: 2 s replication lag; 6 orders/s; Route 53 health checks every 30 s."""
LAG_S, ORDERS_PER_S = 2, 6
CHECK_EVERY_S, FAILURES_TO_FAIL, DNS_TTL_S = 30, 3, 60

lost = LAG_S * ORDERS_PER_S                    # committed in London, not copied
print(f"async copy:    ~{lost} orders lost at failover (RPO)")
detect = CHECK_EVERY_S * FAILURES_TO_FAIL      # health check marks it down
print(f"DNS failover:  {detect} s to detect + {DNS_TTL_S} s TTL ="
      f" {detect + DNS_TTL_S} s before shoppers move")

# Active/active: both Regions take orders for the last p-1002 at once.
stock = {"London": 1, "Ireland": 1}            # each Region's copy, pre-sync
sold = [region for region in stock if stock[region] >= 1]
print(f"active/active: last p-1002 sold in {' and '.join(sold)}"
      " -- one unit, two orders")
