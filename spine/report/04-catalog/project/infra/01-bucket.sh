#!/usr/bin/env bash
# The shop's first resource: the catalog bucket, tagged, with one product.
set -euo pipefail

ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
BUCKET="shop-catalog-$ACCOUNT"

aws s3api create-bucket --bucket "$BUCKET" \
  --create-bucket-configuration LocationConstraint=eu-west-2 > /dev/null
echo "created $BUCKET"
TAGS='TagSet=[{Key=app,Value=shop},{Key=env,Value=dev},{Key=owner,Value=alex}]'
aws s3api put-bucket-tagging --bucket "$BUCKET" --tagging "$TAGS"
aws s3api put-object --bucket "$BUCKET" --key products/p-1001.json \
  --body catalog/p-1001.json --content-type application/json \
  --query ETag --output text
