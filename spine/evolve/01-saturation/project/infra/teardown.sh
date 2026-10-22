#!/usr/bin/env bash
# Delete what infra/ made, newest first.
set -euo pipefail

ACCOUNT=$(aws sts get-caller-identity \
  --query Account --output text)
BUCKET="shop-catalog-$ACCOUNT"

aws s3 rm "s3://$BUCKET" --recursive  # empty it
aws s3api delete-bucket --bucket "$BUCKET"
echo "deleted $BUCKET"
