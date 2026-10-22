#!/usr/bin/env bash
# The shop's network: one VPC, and nine subnets, three tiers in three AZs.
set -euo pipefail

VPC=$(aws ec2 create-vpc --cidr-block 10.20.0.0/16 \
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=shop-prod}]' \
  --query Vpc.VpcId --output text)
printf "%s  %-9s %s\n" "$VPC" shop-prod 10.20.0.0/16

subnet() {  # name, AZ, CIDR
  id=$(aws ec2 create-subnet --vpc-id "$VPC" --cidr-block "$3" \
    --availability-zone "eu-west-2$2" --query Subnet.SubnetId --output text \
    --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=$1}]")
  printf "%s  %-9s eu-west-2%s  %s\n" "$id" "$1" "$2" "$3"
}
subnet public-a a 10.20.0.0/24
subnet public-b b 10.20.1.0/24
subnet public-c c 10.20.2.0/24
subnet app-a a 10.20.10.0/24
subnet app-b b 10.20.11.0/24
subnet app-c c 10.20.12.0/24
subnet data-a a 10.20.20.0/24
subnet data-b b 10.20.21.0/24
subnet data-c c 10.20.22.0/24
