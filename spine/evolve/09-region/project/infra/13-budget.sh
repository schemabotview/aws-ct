#!/usr/bin/env bash
# Warn by email when prod's forecast passes 80% of 400 USD for the month.
set -euo pipefail

ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
aws budgets create-budget --account-id "$ACCOUNT" \
  --budget file://infra/budgets/shop-prod-monthly.json \
  --notifications-with-subscribers '[{"Notification": {
      "NotificationType": "FORECASTED", "ComparisonOperator": "GREATER_THAN",
      "Threshold": 80, "ThresholdType": "PERCENTAGE"},
    "Subscribers": [{"SubscriptionType": "EMAIL",
      "Address": "ops@shop.example.com"}]}]'
