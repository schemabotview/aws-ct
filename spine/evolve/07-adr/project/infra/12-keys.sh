#!/usr/bin/env bash
# The reports key: a customer managed KMS key, its policy, and an alias.
set -euo pipefail

KEY=$(aws kms create-key --description "shop reports" \
  --policy file://policies/reports-key.json --query KeyMetadata.KeyId \
  --output text)
aws kms create-alias --alias-name alias/shop-reports --target-key-id "$KEY"
aws kms enable-key-rotation --key-id "$KEY"
