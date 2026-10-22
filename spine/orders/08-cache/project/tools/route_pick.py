"""Which route does a packet leaving a subnet take? The longest prefix wins."""
import ipaddress
import sys

import boto3

ec2 = boto3.client("ec2")
name, dest = sys.argv[1], ipaddress.ip_address(sys.argv[2])


def tag(item):
    return {t["Key"]: t["Value"] for t in item.get("Tags", [])}.get("Name", "")


subnet = ec2.describe_subnets(
    Filters=[{"Name": "tag:Name", "Values": [name]}])["Subnets"][0]
tables = ec2.describe_route_tables(Filters=[
    {"Name": "association.subnet-id", "Values": [subnet["SubnetId"]]}])
table = (tables["RouteTables"] or ec2.describe_route_tables(Filters=[
    {"Name": "vpc-id", "Values": [subnet["VpcId"]]},
    {"Name": "association.main", "Values": ["true"]}])["RouteTables"])[0]

matches = [(ipaddress.ip_network(r["DestinationCidrBlock"]), r)
           for r in table["Routes"]
           if dest in ipaddress.ip_network(r["DestinationCidrBlock"])]
where = f"{name} → {dest} in {tag(table) or 'the main table'}:"
if not matches:
    print(where, "no route, the packet is dropped")
else:
    network, best = max(matches, key=lambda m: m[0].prefixlen)
    target = best.get("NatGatewayId") or best.get("GatewayId")
    print(where, network, "via", target)
