#!/usr/bin/env bash
# Nightly backups at 02:00 UTC, kept 35 days, with a copy kept 90 days in the
# audit account's vault in another Region -- out of reach of a prod mistake.
set -euo pipefail

aws backup create-backup-vault --backup-vault-name shop-prod-vault > /dev/null
aws backup create-backup-plan --query BackupPlanId --output text \
  --backup-plan file://infra/backup/shop-daily.json
