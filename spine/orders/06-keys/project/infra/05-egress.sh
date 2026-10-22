#!/usr/bin/env bash
# Outbound only, for the app subnets: a NAT gateway in public-a, and a route.
set -euo pipefail

VPC=$(aws ec2 describe-vpcs --filters Name=tag:Name,Values=shop-prod \
  --query 'Vpcs[0].VpcId' --output text)
id() { aws ec2 describe-subnets --filters "Name=tag:Name,Values=$1" \
  --query 'Subnets[0].SubnetId' --output text; }
tags() { echo "ResourceType=$1,Tags=[{Key=Name,Value=$2}]"; }

EIP=$(aws ec2 allocate-address --domain vpc --query AllocationId --output text)
NAT=$(aws ec2 create-nat-gateway --subnet-id "$(id public-a)" \
  --allocation-id "$EIP" --tag-specifications "$(tags natgateway nat-a)" \
  --query NatGateway.NatGatewayId --output text)
aws ec2 wait nat-gateway-available --nat-gateway-ids "$NAT"

RT=$(aws ec2 create-route-table --vpc-id "$VPC" --output text \
  --tag-specifications "$(tags route-table rt-app-a)" \
  --query RouteTable.RouteTableId)
aws ec2 create-route --route-table-id "$RT" --destination-cidr-block 0.0.0.0/0 \
  --nat-gateway-id "$NAT" > /dev/null
aws ec2 associate-route-table --route-table-id "$RT" --subnet-id "$(id app-a)" \
  > /dev/null
echo "$RT  rt-app-a: local, 0.0.0.0/0 via $NAT"
