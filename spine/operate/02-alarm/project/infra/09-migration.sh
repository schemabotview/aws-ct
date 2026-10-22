#!/usr/bin/env bash
# The old data centre's orders database into RDS: copy it, then keep copying.
set -euo pipefail

pw() { aws secretsmanager get-secret-value --secret-id "$1" \
  --query SecretString --output text |
  python -c 'import json, sys; print(json.load(sys.stdin)["password"])'; }
endpoint() { aws dms create-endpoint --endpoint-identifier "$1" \
  --endpoint-type "$2" --engine-name postgres --server-name "$3" \
  --port 5432 --database-name shop --username dms --password "$(pw "$4")" \
  --query Endpoint.EndpointArn --output text; }

SOURCE=$(endpoint dc-orders source orders.dc.example.com dc-orders-dms)
TARGET=$(endpoint rds-orders target "$RDS_HOST" 'rds!db-shop-orders')
INSTANCE=$(aws dms create-replication-instance --allocated-storage 50 \
  --replication-instance-identifier shop-dms \
  --replication-instance-class dms.t3.medium \
  --query ReplicationInstance.ReplicationInstanceArn --output text)

aws dms create-replication-task --replication-task-identifier orders-to-rds \
  --source-endpoint-arn "$SOURCE" --target-endpoint-arn "$TARGET" \
  --replication-instance-arn "$INSTANCE" --migration-type full-load-and-cdc \
  --table-mappings file://infra/dms/table-mappings.json \
  --query 'ReplicationTask.[ReplicationTaskIdentifier,MigrationType,Status]' \
  --output text
