import type { Scene } from '@graphlearning/flow'

// §12.4 — the ADR's migration, EC2 → ECS Fargate, in weighted stages on the ALB listener (request
// validated in full) with a gate before each step; the counts are illustrative, the gate arithmetic
// runs. Rollback is a weight change until a step changes data in a way old code cannot read
// (expand/contract): after the contract step, rolling back means recovery.
// source: https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-listeners.html
export const stagedCutover: Scene = {
  id: 'staged-cutover',
  title: 'Every step has a way back, until one does not',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'weights',
      kind: 'code',
      filename: 'elbv2.ModifyListener.request.json · model-checked',
      hug: true,
      label: `{
  "ListenerArn": "arn:aws:elasticloadbalancing:eu-west-2:111122223333:listener/app/shop-alb/50dc6c495c0c9188/f2f7dc8efc522ab2",
  "DefaultActions": [{
    "Type": "forward",
    "ForwardConfig": { "TargetGroups": [
      { "TargetGroupArn": "arn:aws:elasticloadbalancing:eu-west-2:111122223333:targetgroup/shop-app/73e2d6bc24d8a067", "Weight": 90 },
      { "TargetGroupArn": "arn:aws:elasticloadbalancing:eu-west-2:111122223333:targetgroup/shop-ecs/2a1f9c3e7b4d5e60", "Weight": 10 }
    ] }
  }]
}`,
    },
    {
      id: 'gates',
      kind: 'code',
      filename: 'cutover_gates.py · runs locally',
      hug: true,
      label: `# gates before each step of the EC2 -> ECS cutover (illustrative counts)
stages = [  # (ECS weight %, 5xx rate old, 5xx rate new, orders acknowledged, orders in DB)
    (10, 0.0005, 0.0005, 1_204, 1_204),
    (50, 0.0005, 0.0006, 1_198, 1_198),
    (100, None, 0.0005, 1_210, 1_207),
]
for weight, old, new, acked, stored in stages:
    errors_ok = old is None or new <= old + 0.001
    reconciled = acked == stored
    verdict = "proceed" if errors_ok and reconciled else "roll back"
    print(f"ECS {weight:>3}%: 5xx {new:.2%}, orders {acked} acked /"
          f" {stored} stored -> {verdict}")
    if not reconciled:
        print(f"  weight -> 0, replay {acked - stored} missing orders, find the cause")
        break`,
    },
    {
      id: 'gates-out',
      kind: 'code',
      filename: 'output',
      hug: true,
      label: `ECS  10%: 5xx 0.05%, orders 1204 acked / 1204 stored -> proceed
ECS  50%: 5xx 0.06%, orders 1198 acked / 1198 stored -> proceed
ECS 100%: 5xx 0.05%, orders 1210 acked / 1207 stored -> roll back
  weight -> 0, replay 3 missing orders, find the cause`,
    },
    {
      id: 'boundaries',
      kind: 'table',
      label: 'Rollback boundaries',
      sub: 'where "undo" stops being a weight change',
      headers: ['step', 'roll back by'],
      values: [
        ['ECS 10% → 50% → 100%', 'weight back to EC2'],
        ['EC2 kept warm 7 days', 'weight back to EC2'],
        ['expand: add nullable column', 'old code ignores it'],
        ['contract: drop old column', 'restore — a recovery, not a rollback'],
      ],
    },
  ],
  edges: [],
}
