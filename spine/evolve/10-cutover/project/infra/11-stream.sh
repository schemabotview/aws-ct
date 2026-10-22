#!/usr/bin/env bash
# The clickstream: Kinesis Data Streams, provisioned with two shards.
set -euo pipefail

aws kinesis create-stream --stream-name shop-clickstream --shard-count 2 \
  --stream-mode-details StreamMode=PROVISIONED
aws kinesis wait stream-exists --stream-name shop-clickstream
aws kinesis describe-stream-summary --stream-name shop-clickstream \
  --query 'StreamDescriptionSummary.[OpenShardCount,RetentionPeriodHours]' \
  --output text
