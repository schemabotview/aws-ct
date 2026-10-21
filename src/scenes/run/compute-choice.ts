import type { Scene, SceneNode } from '@graphlearning/flow'

// The four compute models AWS offers for an application like the shop's, compared on control,
// operational effort and latency. Lambda cold starts and the 15-minute limit; Fargate tasks without
// servers to manage; EKS for Kubernetes.
// source: https://docs.aws.amazon.com/decision-guides/latest/decision-guides/choosing-aws-compute-service.html
// source: https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html
const option = (id: string, label: string, sub: string, icon: string, items: string[]): SceneNode =>
  ({ id, kind: 'list', label, sub, icon, pattern: 'service', items })

export const computeChoice: Scene = {
  id: 'compute-choice',
  padding: 0.04,
  flow: 'LR',
  align: 'start',
  header: 'band',
  nodes: [
    {
      id: 'options',
      label: 'Four ways to run the order API',
      bare: true,
      cols: 2,
      children: [
        option('opt-ec2', 'EC2', 'virtual machines', 'ec2', ['You pick the instance, the OS, the patching', 'Runs anything, for as long as you like']),
        option('opt-fargate', 'ECS on Fargate', 'containers, no servers to see', 'fargate', ['You supply an image and a size', 'AWS runs the hosts underneath']),
        option('opt-lambda', 'Lambda', 'functions, per request', 'lambda', ['You supply a handler', 'Up to 15 minutes a call; a cold start sometimes']),
        option('opt-eks', 'EKS', 'Kubernetes, managed control plane', 'kubernetes', ['You run Kubernetes workloads and their nodes', 'Worth it when Kubernetes is the requirement']),
      ],
    },
    {
      id: 'compare-side',
      label: 'Compare',
      bare: true,
      children: [
        {
          id: 'compare',
          kind: 'table',
          label: 'The same API, four ways',
          headers: ['', 'control', 'your ops work', 'latency', 'billed per'],
          values: [
            ['EC2', 'most', 'OS, patches, scaling', 'steady', 'second, while running'],
            ['Fargate', 'image and size', 'the image', 'steady', 'second, per task'],
            ['Lambda', 'handler only', 'least', 'cold starts', 'request and duration'],
            ['EKS', 'Kubernetes', 'cluster and nodes', 'steady', 'cluster hour + nodes'],
          ],
        },
        {
          id: 'shape',
          kind: 'list',
          icon: 'package',
          label: 'The order API’s shape, and the order the course takes',
          pattern: 'user',
          items: [
            'A long-running HTTP server with steady traffic: EC2 or Fargate',
            'Built first on EC2 (§3–6), where every layer is visible',
            'Then as a Fargate task (§7), the same app in an image',
            'Lambda for the checkout in Course 10; EKS weighed in §8',
            'Course 13 compares all three for the whole platform',
          ],
        },
      ],
    },
  ],
  edges: [],
}
