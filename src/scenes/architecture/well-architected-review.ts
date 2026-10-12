import type { Scene } from '@graphlearning/flow'

// §12.5 — an integrated review: six pillars, each with evidence from this course, then findings
// ranked by the reviewers' likelihood × impact / effort (the judgements are recorded; the ranking
// runs). Multi-Region active/active ranks last: no requirement asks for it and it adds failure modes.
// source: https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html
export const wellArchitectedReview: Scene = {
  id: 'well-architected-review',
  title: 'Six pillars, one ranked list',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'pillars',
      kind: 'table',
      label: 'Well-Architected pillars, with this course’s evidence',
      sub: 'evidence, not a checklist',
      headers: ['pillar', 'evidence seen'],
      values: [
        ['operational excellence', 'IaC, change sets, runbooks'],
        ['security', 'roles, key policies, revocation'],
        ['reliability', 'AZ reserve, restore drill, DR'],
        ['performance efficiency', 'p99 model, edge caching'],
        ['cost optimisation', 'tags, anomalies, total cost'],
        ['sustainability', 'idle, movement, retention'],
      ],
    },
    {
      id: 'ranked',
      kind: 'code',
      filename: 'priorities.py · runs locally',
      hug: true,
      label: `# review findings: likelihood and impact 1-3 and effort 1-3 are the reviewers'
# judgement, recorded with the evidence; the program only ranks them
findings = [
    ("cross-Region copy never restored", "reliability", 2, 3, 2, "Ch. 10 drill"),
    ("S3/DynamoDB traffic via NAT", "cost", 3, 1, 1, "Ch. 11 anomaly"),
    ("rotation breaks cached passwords", "security", 2, 2, 1, "Ch. 10 rotation"),
    ("p99 bends above 90% busy", "performance", 2, 2, 2, "Ch. 11 model"),
    ("2% of cost untagged", "cost", 3, 1, 1, "Ch. 11 tags"),
    ("pager alarm has no runbook link", "operations", 2, 2, 1, "Ch. 10 alarm"),
    ("app logs never expire", "sustainability", 3, 1, 1, "Ch. 11 footprint"),
    ("go multi-Region active/active", "reliability", 1, 3, 3, "no requirement"),
]
ranked = sorted(findings, key=lambda f: -(f[2] * f[3]) / f[4])
for name, pillar, likely, impact, effort, evidence in ranked:
    score = likely * impact / effort
    print(f"{score:4.1f}  {name:<33} {pillar:<15} {evidence}")`,
    },
    {
      id: 'ranked-out',
      kind: 'code',
      filename: 'output',
      hug: true,
      label: ` 4.0  rotation breaks cached passwords  security        Ch. 10 rotation
 4.0  pager alarm has no runbook link   operations      Ch. 10 alarm
 3.0  cross-Region copy never restored  reliability     Ch. 10 drill
 3.0  S3/DynamoDB traffic via NAT       cost            Ch. 11 anomaly
 3.0  2% of cost untagged               cost            Ch. 11 tags
 3.0  app logs never expire             sustainability  Ch. 11 footprint
 2.0  p99 bends above 90% busy          performance     Ch. 11 model
 1.0  go multi-Region active/active     reliability     no requirement`,
    },
  ],
  edges: [],
}
