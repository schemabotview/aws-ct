"""Cut the shop's VPC range into nine subnets: three tiers in three AZs."""
import ipaddress

vpc = ipaddress.ip_network("10.20.0.0/16")
print(f"{vpc} holds {vpc.num_addresses:,} addresses")

TIERS = {"public": 0, "app": 10, "data": 20}  # third octet of each tier's first
for tier, start in TIERS.items():
    for i, az in enumerate("abc"):
        subnet = ipaddress.ip_network(f"10.20.{start + i}.0/24")
        assert subnet.subnet_of(vpc)
        usable = subnet.num_addresses - 5  # AWS keeps five in every subnet
        name = f"{tier}-{az}"
        print(f"{name:9} {str(subnet):15} eu-west-2{az}  {usable} usable")

server = ipaddress.ip_address("10.20.11.37")
print(server, "is in app-b:", server in ipaddress.ip_network("10.20.11.0/24"))
