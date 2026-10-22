#!/usr/bin/env bash
# Shift checkout from the EC2 servers to ECS Fargate in steps:
#   bash infra/13-cutover.sh 90 10   ->  90% shop-app (EC2), 10% shop-ecs
set -euo pipefail

arn() { aws elbv2 describe-target-groups --names "$1" \
  --query 'TargetGroups[0].TargetGroupArn' --output text; }
LB=$(aws elbv2 describe-load-balancers --names shop-alb \
  --query 'LoadBalancers[0].LoadBalancerArn' --output text)
LISTENER=$(aws elbv2 describe-listeners --load-balancer-arn "$LB" \
  --query 'Listeners[?Port==`443`].ListenerArn' --output text)
aws elbv2 modify-listener --listener-arn "$LISTENER" --default-actions \
  "Type=forward,ForwardConfig={TargetGroups=[\
{TargetGroupArn=$(arn shop-app),Weight=$1},\
{TargetGroupArn=$(arn shop-ecs),Weight=$2}]}" \
  --query 'Listeners[0].DefaultActions[0].ForwardConfig.TargetGroups[].Weight' \
  --output text
