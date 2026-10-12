import type { Scene } from '@graphlearning/flow'

// §4.7 — when Kubernetes earns its cost. EKS charges per cluster-hour on top of nodes ($0.10/h in
// standard support, $0.60/h in extended support); each Kubernetes version gets about 14 months of
// standard support, so upgrades are a recurring job. The manifest is illustrative (not run here).
// source: https://aws.amazon.com/eks/pricing/
// source: https://docs.aws.amazon.com/eks/latest/userguide/kubernetes-versions.html
export const eksChoice: Scene = {
  id: 'eks-choice',
  title: 'Orchestration has to pay for itself',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'manifest',
      kind: 'code',
      filename: 'deployment.yaml · illustrative',
      hug: true,
      label: `apiVersion: apps/v1
kind: Deployment
metadata: { name: order-api }
spec:
  replicas: 6
  selector: { matchLabels: { app: order-api } }
  template:
    metadata: { labels: { app: order-api } }
    spec:
      containers:
        - name: app
          image: 111122223333.dkr.ecr.eu-west-2.amazonaws.com/order-api:1.4.2
          ports: [{ containerPort: 8080 }]`,
    },
    {
      id: 'tradeoff',
      kind: 'table',
      label: 'EKS for the shop?',
      sub: 'justified by needs, not by fashion',
      headers: ['worth it when', 'costs you'],
      values: [
        ['many services, many teams', 'a cluster fee every hour'],
        ['Kubernetes tools already in use', 'a version upgrade ~yearly'],
        ['one platform across clouds', 'nodes, add-ons, networking'],
        ['custom scheduling needs', 'people who know Kubernetes'],
      ],
    },
    {
      id: 'verdict',
      kind: 'list',
      framed: true,
      label: 'Verdict for one order API',
      icon: 'scale',
      pattern: 'network',
      items: [
        'one service, one team: ECS is enough',
        'revisit when services and teams multiply',
      ],
    },
  ],
  edges: [],
}
