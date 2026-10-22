#!/usr/bin/env bash
# A name for the shop: the example.com zone, and an alias to the load balancer.
set -euo pipefail

ZONE=$(aws route53 create-hosted-zone --name example.com \
  --caller-reference shop-zone-1 --query HostedZone.Id --output text)
aws route53 change-resource-record-sets --hosted-zone-id "$ZONE" \
  --change-batch file://infra/dns/shop-alias.json \
  --query ChangeInfo.Status --output text
aws route53 list-resource-record-sets --hosted-zone-id "$ZONE" --output text \
  --query "ResourceRecordSets[?Type=='A'].[Name,AliasTarget.DNSName]"
