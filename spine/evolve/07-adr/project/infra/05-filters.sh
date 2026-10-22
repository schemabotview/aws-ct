#!/usr/bin/env bash
# Who may connect to what: a chain of security groups, ALB → app → DB.
set -euo pipefail

VPC=$(aws ec2 describe-vpcs --filters Name=tag:Name,Values=shop-prod \
  --query 'Vpcs[0].VpcId' --output text)
group() { aws ec2 create-security-group --vpc-id "$VPC" --group-name "$1" \
  --description "$2" --query GroupId --output text; }
allow() { aws ec2 authorize-security-group-ingress --group-id "$1" \
  --protocol tcp --port "$2" "${@:3}" > /dev/null; }

ALB=$(group sg-alb "load balancer"); APP=$(group sg-app "app servers")
DB=$(group sg-db "orders database")
allow "$ALB" 443 --cidr 0.0.0.0/0      # HTTPS from anywhere
allow "$APP" 8080 --source-group "$ALB" # the app port, from the ALB only
allow "$DB" 5432 --source-group "$APP"  # PostgreSQL, from the app only
echo "sg-alb $ALB  sg-app $APP  sg-db $DB"
