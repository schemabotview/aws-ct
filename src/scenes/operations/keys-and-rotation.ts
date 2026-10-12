import type { Scene } from '@graphlearning/flow'

// §10.5 — a KMS key policy for the reports key (the key policy is required; the account statement
// lets IAM policies delegate), and a secret rotation that breaks connections: the app cached the
// password at start-up, single-user rotation changed it, new connections fail until the app re-reads
// the secret. Alternating-users rotation avoids the gap (not supported through RDS Proxy).
// source: https://docs.aws.amazon.com/kms/latest/developerguide/key-policy-default.html
// source: https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotation-strategy.html
export const keysAndRotation: Scene = {
  id: 'keys-and-rotation',
  title: 'A rotation that breaks a connection',
  cols: 2,
  padding: 0.05,
  nodes: [
    {
      id: 'key-policy',
      kind: 'code',
      filename: 'shop-reports-key-policy.json · model-checked',
      hug: true,
      label: `{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "AccountAdmin",
    "Effect": "Allow",
    "Principal": {
      "AWS": "arn:aws:iam::111122223333:root"
    },
    "Action": "kms:*",
    "Resource": "*"
  }, {
    "Sid": "AuditorDecrypt",
    "Effect": "Allow",
    "Principal": {
      "AWS": "arn:aws:iam::777788889999:role/Auditor"
    },
    "Action": ["kms:Decrypt", "kms:DescribeKey"],
    "Resource": "*"
  }]
}`,
    },
    {
      id: 'rotate',
      label: 'Single-user rotation at 09:30',
      pattern: 'group',
      cols: 1,
      children: [
        {
          id: 'rotation',
          kind: 'code',
          filename: 'rotation.py · runs locally',
          hug: true,
          label: `db = {"password": "v1"}         # what PostgreSQL accepts
secret = {"current": "v1"}      # what Secrets Manager holds
cached = secret["current"]      # the app read it once, at start-up


def connect(password):
    return "ok" if password == db["password"] else "auth failed"


print("09:00 new connection:", connect(cached))
db["password"] = secret["current"] = "v2"   # single-user rotation
print("09:30 rotated; new connection:", connect(cached))


def connect_with_refresh():     # the fix: re-read once, then retry
    global cached
    result = connect(cached)
    if result == "auth failed":
        cached = secret["current"]
        result = connect(cached)
    return result


print("09:31 with re-read on failure:", connect_with_refresh())`,
        },
        {
          id: 'rotation-out',
          kind: 'code',
          filename: 'output',
          hug: true,
          label: `09:00 new connection: ok
09:30 rotated; new connection: auth failed
09:31 with re-read on failure: ok`,
        },
      ],
    },
  ],
  edges: [],
}
