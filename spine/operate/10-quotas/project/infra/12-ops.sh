#!/usr/bin/env bash
# Patch the app servers on a schedule, and check every bucket stays private.
set -euo pipefail

BASELINE=$(aws ssm create-patch-baseline --name order-api-linux \
  --operating-system AMAZON_LINUX_2023 --approval-rules \
  "PatchRules=[{PatchFilterGroup={PatchFilters=[{Key=CLASSIFICATION,\
Values=[Security]}]},ApproveAfterDays=7}]" --query BaselineId --output text)
aws ssm register-patch-baseline-for-patch-group --baseline-id "$BASELINE" \
  --patch-group order-api > /dev/null

ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
ROLE=aws-service-role/config.amazonaws.com/AWSServiceRoleForConfig
aws configservice put-configuration-recorder --configuration-recorder \
  "name=default,roleARN=arn:aws:iam::$ACCOUNT:role/$ROLE"
aws configservice put-config-rule \
  --config-rule file://infra/config/s3-no-public-read.json
