#!/usr/bin/env bash
# Page the on-call when checkout burns its error budget about 14x too fast.
set -euo pipefail

PAGER=$(aws sns create-topic --name ops-pager --query TopicArn --output text)
aws cloudwatch put-metric-alarm --alarm-name checkout-5xx-fast-burn \
  --namespace AWS/ApiGateway --metric-name 5XXError \
  --dimensions Name=ApiName,Value=shop-api Name=Stage,Value=prod \
  --statistic Sum --period 60 --evaluation-periods 5 --datapoints-to-alarm 5 \
  --comparison-operator GreaterThanThreshold --threshold 5 \
  --treat-missing-data notBreaching --alarm-actions "$PAGER"
