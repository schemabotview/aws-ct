#!/usr/bin/env bash
# CloudFront in front of the load balancer: the product pages, cached at the
# edge for 60 s, keyed on the path and the lang query string only.
set -euo pipefail

aws cloudfront create-distribution \
  --distribution-config file://infra/cdn/distribution.json \
  --query 'Distribution.[Id,DomainName,Status]' --output text
