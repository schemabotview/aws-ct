"""Credentials from Secrets Manager, and the connection budget."""
import json
import os

import boto3

# 1. The password is in no file, image or template: read it at start-up.
secrets = boto3.client("secretsmanager")
value = secrets.get_secret_value(SecretId=os.environ["ORDERS_SECRET"])
creds = json.loads(value["SecretString"])
print(f"user {creds['username']}, password {len(creds['password'])} chars,"
      f" from {value['Name']}")

# 2. Every server opens its own pool. PostgreSQL has one budget for all.
MAX_CONNECTIONS = 200   # assumed for db.r7g.large; check the parameter group
RESERVED = 10           # superuser and replication slots
POOL = 20               # per app server
budget = MAX_CONNECTIONS - RESERVED
for n in (3, 6, 9, 12):
    wanted = n * POOL
    refused = max(0, wanted - budget)
    print(f"{n:>2} servers want {wanted:>3} of {budget}: {refused} refused")
