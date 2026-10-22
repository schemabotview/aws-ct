#!/usr/bin/env bash
# The app servers as a group: three, one per AZ, and six for the evening.
set -euo pipefail

id() { aws ec2 describe-subnets --filters "Name=tag:Name,Values=$1" \
  --query 'Subnets[0].SubnetId' --output text; }
SUBNETS="$(id app-a),$(id app-b),$(id app-c)"
TG=$(aws elbv2 describe-target-groups --names shop-app \
  --query 'TargetGroups[0].TargetGroupArn' --output text)

aws autoscaling create-auto-scaling-group --auto-scaling-group-name order-api \
  --launch-template 'LaunchTemplateName=order-api,Version=$Latest' \
  --min-size 3 --max-size 9 --desired-capacity 3 \
  --vpc-zone-identifier "$SUBNETS" --target-group-arns "$TG" \
  --health-check-type ELB --health-check-grace-period 120
aws autoscaling put-scheduled-update-group-action \
  --auto-scaling-group-name order-api --scheduled-action-name evening-peak \
  --recurrence "45 17 * * *" --time-zone Europe/London --min-size 6
