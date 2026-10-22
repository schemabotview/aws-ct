#!/usr/bin/env bash
# The load balancer in the public subnets, and the target group it checks.
set -euo pipefail

VPC=$(aws ec2 describe-vpcs --filters Name=tag:Name,Values=shop-prod \
  --query 'Vpcs[0].VpcId' --output text)
id() { aws ec2 describe-subnets --filters "Name=tag:Name,Values=$1" \
  --query 'Subnets[0].SubnetId' --output text; }
SG=$(aws ec2 describe-security-groups --filters Name=group-name,Values=sg-alb \
  --query 'SecurityGroups[0].GroupId' --output text)

aws elbv2 create-target-group --name shop-app --vpc-id "$VPC" \
  --protocol HTTP --port 8080 --health-check-path /health \
  --health-check-interval-seconds 10 \
  --unhealthy-threshold-count 2 --healthy-threshold-count 3 \
  --query 'TargetGroups[0].TargetGroupName' --output text
aws elbv2 create-load-balancer --name shop-alb --type application \
  --subnets "$(id public-a)" "$(id public-b)" "$(id public-c)" \
  --security-groups "$SG" --output text \
  --query 'LoadBalancers[0].[LoadBalancerName,Type]'
