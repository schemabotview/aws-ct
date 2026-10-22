#!/usr/bin/env bash
# One order-events topic, three queues that each get their own copy.
set -euo pipefail

TOPIC=$(aws sns create-topic --name order-events --query TopicArn --output text)
for q in fulfilment loyalty fraud-check; do
  URL=$(aws sqs create-queue --queue-name "$q" --query QueueUrl --output text)
  ARN=$(aws sqs get-queue-attributes --queue-url "$URL" \
    --attribute-names QueueArn --query Attributes.QueueArn --output text)
  # Only this topic may send to the queue.
  python tools/allow_send.py "$URL" sns.amazonaws.com "$TOPIC"
  SUB=$(aws sns subscribe --topic-arn "$TOPIC" --protocol sqs \
    --notification-endpoint "$ARN" --attributes RawMessageDelivery=true \
    --query SubscriptionArn --output text)
  if [ "$q" = fraud-check ]; then   # only orders of 500 or more
    aws sns set-subscription-attributes --subscription-arn "$SUB" \
      --attribute-name FilterPolicy \
      --attribute-value file://infra/sns/fraud-filter.json
  fi
done
