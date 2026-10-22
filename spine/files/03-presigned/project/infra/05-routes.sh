#!/usr/bin/env bash
# The way in and out for the public subnets: an internet gateway and a route.
set -euo pipefail

VPC=$(aws ec2 describe-vpcs --filters Name=tag:Name,Values=shop-prod \
  --query 'Vpcs[0].VpcId' --output text)
id() { aws ec2 describe-subnets --filters "Name=tag:Name,Values=$1" \
  --query 'Subnets[0].SubnetId' --output text; }
tags() { echo "ResourceType=$1,Tags=[{Key=Name,Value=$2}]"; }

IGW=$(aws ec2 create-internet-gateway --output text \
  --tag-specifications "$(tags internet-gateway igw-shop)" \
  --query InternetGateway.InternetGatewayId)
aws ec2 attach-internet-gateway --internet-gateway-id "$IGW" --vpc-id "$VPC"

RT=$(aws ec2 create-route-table --vpc-id "$VPC" --output text \
  --tag-specifications "$(tags route-table rt-public)" \
  --query RouteTable.RouteTableId)
aws ec2 create-route --route-table-id "$RT" --destination-cidr-block 0.0.0.0/0 \
  --gateway-id "$IGW" > /dev/null
for s in public-a public-b public-c; do
  aws ec2 associate-route-table --route-table-id "$RT" --subnet-id "$(id $s)" \
    > /dev/null
done
echo "$RT  rt-public: local, 0.0.0.0/0 via $IGW"
