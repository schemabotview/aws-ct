import type { Scene } from '@graphlearning/flow'

// §9.7 — promotion: the SAME image digest moves from dev to prod; the pipeline's role in dev may only
// assume a narrowly-trusted deploy role in prod (trust policy parliament-checked). Provenance = which
// commit built which digest, recorded by the pipeline. CloudFormation, CDK (code that synthesises
// CloudFormation) and Terraform (its own state file and providers) are authoring choices, not courses.
// source: https://docs.aws.amazon.com/cdk/v2/guide/home.html
export const promotionAndTools: Scene = {
  id: 'promotion-and-tools',
  title: 'Promote the artefact, not the build',
  flow: 'TB',
  padding: 0.05,
  nodes: [
    {
      id: 'path',
      label: 'One digest, two accounts, two roles',
      pattern: 'group',
      cols: 3,
      children: [
        { id: 'p-build', label: 'Build once', sub: 'commit 9f3c2e1', pattern: 'service', icon: 'codebuild' },
        { id: 'p-dev', label: 'dev deploy', sub: 'role ShopDeploy (dev)', pattern: 'service', icon: 'codepipeline' },
        { id: 'p-prod', label: 'prod deploy', sub: 'role ShopDeploy (prod)', pattern: 'warn', icon: 'codedeploy' },
      ],
    },
    {
      id: 'trust',
      kind: 'code',
      filename: 'prod-deploy-trust.json · model-checked',
      hug: true,
      label: `{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": {
      "AWS": "arn:aws:iam::444455556666:role/ShopPipeline"
    },
    "Action": "sts:AssumeRole"
  }]
}`,
    },
    {
      id: 'tools',
      kind: 'table',
      label: 'Three ways to author the same stack',
      sub: 'choose one per team; mix with care',
      headers: ['tool', 'you write', 'state lives in'],
      values: [
        ['CloudFormation', 'YAML / JSON', 'the stack (AWS)'],
        ['AWS CDK', 'code → CloudFormation', 'the stack (AWS)'],
        ['Terraform', 'HCL', 'a state file you store'],
      ],
    },
  ],
  edges: [],
}
