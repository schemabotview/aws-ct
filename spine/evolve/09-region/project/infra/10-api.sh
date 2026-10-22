#!/usr/bin/env bash
# POST /orders: who may call it, what a body must look like, and how fast.
set -euo pipefail

POOL=$(aws cognito-idp create-user-pool --pool-name shoppers \
  --query UserPool.Arn --output text)
API=$(aws apigateway create-rest-api --name shop-api --query id --output text)
ROOT=$(aws apigateway get-resources --rest-api-id "$API" \
  --query 'items[0].id' --output text)
ORDERS=$(aws apigateway create-resource --rest-api-id "$API" \
  --parent-id "$ROOT" --path-part orders --query id --output text)

aws apigateway create-model --rest-api-id "$API" --name Order \
  --content-type application/json --schema file://infra/api/order-model.json \
  > /dev/null
CHECK=$(aws apigateway create-request-validator --rest-api-id "$API" \
  --name body-only --validate-request-body --query id --output text)
AUTH=$(aws apigateway create-authorizer --rest-api-id "$API" --name shoppers \
  --type COGNITO_USER_POOLS --provider-arns "$POOL" --query id --output text \
  --identity-source method.request.header.Authorization)

aws apigateway put-method --rest-api-id "$API" --resource-id "$ORDERS" \
  --http-method POST --authorization-type COGNITO_USER_POOLS \
  --authorizer-id "$AUTH" --request-validator-id "$CHECK" \
  --request-models application/json=Order > /dev/null
# Until section 2's function exists, the method answers from a mock.
aws apigateway put-integration --rest-api-id "$API" --resource-id "$ORDERS" \
  --http-method POST --type MOCK > /dev/null

aws apigateway create-deployment --rest-api-id "$API" --stage-name prod \
  > /dev/null
aws apigateway update-stage --rest-api-id "$API" --stage-name prod \
  --patch-operations op=replace,path=/*/*/throttling/rateLimit,value=600 \
  op=replace,path=/*/*/throttling/burstLimit,value=1200 > /dev/null
echo "shop-api $API, stage prod"
