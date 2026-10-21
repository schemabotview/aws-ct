#!/usr/bin/env bash
# OrderApi: the role the app servers act as, and the profile that carries it.
set -euo pipefail

aws iam create-role --role-name OrderApi \
  --assume-role-policy-document file://policies/order-api-trust.json \
  --query Role.Arn --output text
aws iam create-instance-profile --instance-profile-name OrderApi \
  --query InstanceProfile.Arn --output text
aws iam add-role-to-instance-profile --instance-profile-name OrderApi \
  --role-name OrderApi
