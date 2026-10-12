import type { Scene } from '@graphlearning/flow'

// §10.10 — limits and dependency failures. Some quotas are adjustable (Lambda concurrent executions,
// API Gateway account throttle), some are fixed (Lambda timeout 900 s); the Adjustable field says
// which. Throttled callers retry with capped exponential backoff and FULL jitter so they do not retry
// in lockstep. Resilience claims are validated by injecting the failure (e.g. Fault Injection Service).
// source: https://docs.aws.amazon.com/servicequotas/latest/userguide/intro.html
// source: https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/
export const quotasAndResilience: Scene = {
  id: 'quotas-and-resilience',
  title: 'Limits you can raise, and limits you design around',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'quotas',
      kind: 'table',
      label: 'Quotas the shop depends on',
      sub: 'check Adjustable before planning a raise',
      headers: ['quota', 'value used', 'adjustable?'],
      values: [
        ['Lambda concurrent executions', '1,000 / Region', 'yes'],
        ['API Gateway account throttle', '10,000 rps', 'yes'],
        ['Lambda function timeout', '900 s', 'no — redesign'],
        ['Fargate tasks, EC2 vCPUs', 'per account', 'yes, ahead of peaks'],
      ],
    },
    {
      id: 'jitter',
      kind: 'code',
      filename: 'backoff_jitter.py · runs locally',
      hug: true,
      label: `import random

random.seed(4)
BASE, CAP = 0.1, 5.0   # seconds


def full_jitter(attempt):  # sleep = random(0, min(cap, base * 2^n))
    return random.uniform(0, min(CAP, BASE * 2 ** attempt))


for client in ("A", "B", "C"):
    waits = [full_jitter(n) for n in range(5)]
    print(f"client {client}:", " ".join(f"{w:4.2f}" for w in waits))
print("no jitter:  ", " ".join(f"{min(CAP, BASE * 2 ** n):4.2f}"
                               for n in range(5)), "(all three)")`,
    },
    {
      id: 'jitter-out',
      kind: 'code',
      filename: 'output',
      hug: true,
      label: `client A: 0.02 0.02 0.16 0.12 0.11
client B: 0.04 0.18 0.32 0.61 0.36
client C: 0.05 0.06 0.07 0.08 0.34
no jitter:   0.10 0.20 0.40 0.80 1.60 (all three)`,
    },
    {
      id: 'check',
      kind: 'code',
      filename: 'quotas.sh · model-checked',
      hug: true,
      label: `aws service-quotas list-service-quotas --service-code lambda \\
  --query "Quotas[].[QuotaName,Value,Adjustable]" --output table`,
    },
  ],
  edges: [],
}
