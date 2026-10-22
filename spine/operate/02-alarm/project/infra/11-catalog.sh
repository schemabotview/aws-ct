#!/usr/bin/env bash
# The lake's catalog: a database, the order_history table, and who reads what.
set -euo pipefail

aws glue create-database --database-input Name=shop_lake
aws glue create-table --database-name shop_lake \
  --table-input file://infra/glue/order-history.json
LAKE=s3://shop-lake-111122223333/order_history
for d in 11 12 13; do      # register partitions; a crawler could find them
  aws glue create-partition --database-name shop_lake \
    --table-name order_history --partition-input \
    "Values=2026-09-$d,StorageDescriptor={Location=$LAKE/dt=2026-09-$d/}"
done

# Analysts may read every column except who the customer is.
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
aws lakeformation grant-permissions --permissions SELECT \
  --principal "DataLakePrincipalIdentifier=arn:aws:iam::$ACCOUNT:role/Analyst" \
  --resource "{\"TableWithColumns\": {\"DatabaseName\": \"shop_lake\",
    \"Name\": \"order_history\",
    \"ColumnWildcard\": {\"ExcludedColumnNames\": [\"customer\"]}}}"
