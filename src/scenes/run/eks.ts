import type { Scene } from '@graphlearning/flow'

// EKS runs a managed Kubernetes control plane (billed per cluster hour); the nodes or Fargate pods,
// upgrades, add-ons and Kubernetes RBAC remain the team's. The manifest is illustrative.
// source: https://docs.aws.amazon.com/eks/latest/userguide/what-is-eks.html
// source: https://docs.aws.amazon.com/eks/latest/userguide/kubernetes-versions.html
const MANIFEST = [
  'apiVersion: apps/v1',
  'kind: Deployment',
  'metadata:',
  '  name: order-api',
  'spec:',
  '  replicas: 3',
  '  selector: {matchLabels: {app: order-api}}',
  '  template:',
  '    metadata: {labels: {app: order-api}}',
  '    spec:',
  '      containers:',
  '        - name: app',
  '          image: 111122223333.dkr.ecr.eu-west-2.amazonaws.com/order-api:1.4.2',
  '          ports: [{containerPort: 8080}]',
].join('\n')

export const eks: Scene = {
  id: 'eks-choice',
  padding: 0.04,
  flow: 'LR',
  align: 'start',
  header: 'band',
  nodes: [
    { id: 'manifest', kind: 'code', filename: 'order-api-deployment.yaml · illustrative', label: MANIFEST },
    {
      id: 'eks-side',
      label: 'Worth it?',
      bare: true,
      children: [
        {
          id: 'worth',
          kind: 'table',
          label: 'What Kubernetes buys, and what it costs',
          headers: ['buys', 'costs'],
          values: [
            ['one API across clouds and data centres', 'a cluster to upgrade, several times a year'],
            ['a large ecosystem: Helm, operators', 'add-ons, node groups, networking plugins'],
            ['fine control of scheduling', 'Kubernetes RBAC beside IAM'],
            ['a platform for many teams', 'people who know it well'],
          ],
        },
        {
          id: 'verdict',
          kind: 'list',
          icon: 'scale',
          label: 'For the shop',
          pattern: 'user',
          items: [
            'One service, one team, one cloud: Kubernetes is not the requirement',
            'ECS on Fargate runs the same image with no cluster to upgrade',
            'Choose EKS when the requirement IS Kubernetes: many teams, portability, its ecosystem',
          ],
        },
      ],
    },
  ],
  edges: [],
}
