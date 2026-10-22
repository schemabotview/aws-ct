#!/usr/bin/env bash
# A trail: every API call in the account, kept in S3 beyond 90 days, plus
# the object-level (data) events on the reports bucket.
set -euo pipefail

ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
aws s3api create-bucket --bucket "shop-trail-$ACCOUNT" \
  --create-bucket-configuration LocationConstraint=eu-west-2 > /dev/null
aws cloudtrail create-trail --name shop-trail --is-multi-region-trail \
  --s3-bucket-name "shop-trail-$ACCOUNT" > /dev/null
aws cloudtrail put-event-selectors --trail-name shop-trail \
  --event-selectors file://infra/trail/event-selectors.json > /dev/null
aws cloudtrail start-logging --name shop-trail
