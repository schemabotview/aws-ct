#!/usr/bin/env bash
# What every app server starts from: one launch template.
set -euo pipefail

AMI=$(aws ssm get-parameter --query Parameter.Value --output text \
  --name /aws/service/ami-amazon-linux-latest/al2023-ami-kernel-default-arm64)
SG=$(aws ec2 describe-security-groups --filters Name=group-name,Values=sg-app \
  --query 'SecurityGroups[0].GroupId' --output text)

aws ec2 create-launch-template --launch-template-name order-api \
  --query 'LaunchTemplate.[LaunchTemplateName,LatestVersionNumber]' \
  --output text --launch-template-data "{
    \"ImageId\": \"$AMI\", \"InstanceType\": \"m7g.large\",
    \"IamInstanceProfile\": {\"Name\": \"OrderApi\"},
    \"SecurityGroupIds\": [\"$SG\"],
    \"MetadataOptions\": {\"HttpTokens\": \"required\"}}"
