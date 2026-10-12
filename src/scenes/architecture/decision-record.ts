import type { Scene } from '@graphlearning/flow'

// §12.1 — requirements first, then options checked against them, then a decision record that names
// what was rejected and why. Each requirement's evidence is from an earlier chapter; the ADR text is
// illustrative (a format, not a captured document).
// source: https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/welcome.html
export const decisionRecord: Scene = {
  id: 'decision-record',
  title: 'A decision you can revisit',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'requirements',
      kind: 'table',
      label: 'Order platform: requirements and options',
      sub: 'yes / no against each hard requirement',
      headers: ['requirement', 'EC2', 'ECS Fargate', 'Lambda+DDB', 'EKS'],
      values: [
        ['560 req/s, p99 ≤ 300 ms', 'yes', 'yes', 'yes', 'yes'],
        ['survives one AZ', 'yes', 'yes', 'yes', 'yes'],
        ['RPO ≤ 15 min, RTO ≤ 90 min', 'yes', 'yes', 'yes', 'yes'],
        ['keeps PostgreSQL (reports, CDC)', 'yes', 'yes', 'no', 'yes'],
        ['3-person team, no Kubernetes', 'yes', 'yes', 'yes', 'no'],
        ['no OS patching by the team', 'no', 'yes', 'yes', 'no'],
      ],
    },
    {
      id: 'adr',
      kind: 'code',
      filename: 'adr-007-order-platform.md · illustrative',
      hug: true,
      label: `# ADR-007: run the order API on ECS Fargate
Status: accepted, 2026-10-12      Revisit: if peak > 5x or PostgreSQL is dropped

Context:  560 req/s peak; must survive an AZ; RPO 15 min, RTO 90 min;
          reports and CDC read PostgreSQL; a 3-person team.
Decision: ECS Fargate behind the ALB, RDS PostgreSQL Multi-AZ (unchanged).
Rejected: EC2 Auto Scaling - meets all, but the team patches the OS.
          Lambda + DynamoDB - would rewrite the order transaction and reports.
          EKS - needs Kubernetes skills the team does not have.
Consequences: image pipeline and task roles (Ch. 4, 9); per-task cost;
          no SSH - Session Manager / ECS Exec only.`,
    },
  ],
  edges: [],
}
