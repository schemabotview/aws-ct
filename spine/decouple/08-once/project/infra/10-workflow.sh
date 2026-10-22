#!/usr/bin/env bash
# The order workflow as a Step Functions state machine.
set -euo pipefail

ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
aws stepfunctions create-state-machine --name place-order \
  --definition file://workflows/place-order.asl.json \
  --role-arn "arn:aws:iam::$ACCOUNT:role/OrderWorkflow" \
  --query stateMachineArn --output text
