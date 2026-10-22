#!/usr/bin/env bash
# The shop's event bus: publishers say what happened, rules decide who hears.
set -euo pipefail

aws events create-event-bus --name shop > /dev/null
rule() {  # rule NAME QUEUE: the pattern in infra/events/NAME.json -> a queue
  URL=$(aws sqs create-queue --queue-name "$2" --query QueueUrl --output text)
  ARN=$(aws sqs get-queue-attributes --queue-url "$URL" \
    --attribute-names QueueArn --query Attributes.QueueArn --output text)
  RULE=$(aws events put-rule --name "$1" --event-bus-name shop \
    --event-pattern "file://infra/events/$1.json" --query RuleArn --output text)
  python tools/allow_send.py "$URL" events.amazonaws.com "$RULE"
  aws events put-targets --rule "$1" --event-bus-name shop \
    --targets "Id=$2,Arn=$ARN" > /dev/null
}
rule uk-vat vat-ledger
rule refunds refunds
