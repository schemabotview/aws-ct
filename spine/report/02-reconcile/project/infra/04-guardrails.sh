#!/usr/bin/env bash
# Run in the management account: keep every workload account in eu-west-2.
set -euo pipefail

ROOT=$(aws organizations list-roots --query 'Roots[0].Id' --output text)
OU=$(aws organizations list-organizational-units-for-parent \
  --parent-id "$ROOT" --output text \
  --query "OrganizationalUnits[?Name=='Workloads'].Id")
POLICY=$(aws organizations create-policy --name StayInLondon \
  --type SERVICE_CONTROL_POLICY --description "Workloads stay in eu-west-2" \
  --content file://policies/scp-regions.json \
  --query Policy.PolicySummary.Id --output text)
aws organizations attach-policy --policy-id "$POLICY" --target-id "$OU"
echo "attached $POLICY to $OU"
aws organizations list-targets-for-policy --policy-id "$POLICY" \
  --query 'Targets[].[Name,Type]' --output text
