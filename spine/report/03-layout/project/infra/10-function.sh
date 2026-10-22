#!/usr/bin/env bash
# Package place-order and create it: Python 3.13 on Graviton, 512 MB, 10 s.
set -euo pipefail

mkdir -p build
(cd functions/place_order && python -m zipfile -c ../../build/place-order.zip \
  handler.py)
ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
aws lambda create-function --function-name place-order \
  --runtime python3.13 --architectures arm64 --memory-size 512 --timeout 10 \
  --role "arn:aws:iam::$ACCOUNT:role/PlaceOrderFn" \
  --handler handler.handler --zip-file fileb://build/place-order.zip \
  --environment 'Variables={STOCK_TABLE=Stock,ORDERS_TABLE=Orders}' \
  --query '[FunctionName,Runtime,Architectures[0],MemorySize,Timeout]' \
  --output text
