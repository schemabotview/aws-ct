import type { Scene } from '@graphlearning/flow'
import { BUILT_BY, mapFrame } from '../map'
import code from '../../../spine/automate/08-promotion/project/policies/shop-deploy-trust.json?raw'

// One artefact promoted from dev to prod: the pipeline runs in dev as ShopPipeline and may assume
// ShopDeploy in production — the only principal that role trusts, and only from inside the
// organization (aws:PrincipalOrgID). CDK synthesises CloudFormation; Terraform keeps its own state.
// source: https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_condition-keys.html#condition-keys-principalorgid
// source: https://docs.aws.amazon.com/cdk/v2/guide/home.html
export const promotion: Scene = mapFrame('promotion-and-tools', [...BUILT_BY[6], 'stacks', 'pipeline'], {
  id: 'promotion-pane',
  label: 'side',
  bare: true,
  children: [
    {
      id: 'stages',
      kind: 'table',
      label: 'Commit 9f3c2e1, from build to production',
      headers: ['stage', 'account', 'what happens'],
      values: [
        ['build', 'dev 444455556666', 'one image, digest recorded'],
        ['deploy dev', 'dev 444455556666', 'the same digest, tested'],
        ['deploy prod', 'prod 111122223333', 'ShopPipeline assumes ShopDeploy'],
      ],
    },
    { id: 'deploy-trust', kind: 'code', filename: 'policies/shop-deploy-trust.json', label: code.replace(/\n+$/, ''), highlight: [5, 6, 7, 8, 9] },
    {
      id: 'tools',
      kind: 'table',
      label: 'CloudFormation, CDK or Terraform',
      headers: ['tool', 'you write', 'state kept by'],
      values: [
        ['CloudFormation', 'YAML or JSON', 'the stack, in AWS'],
        ['CDK', 'code that generates CloudFormation', 'the stack, in AWS'],
        ['Terraform', 'HCL, any provider', 'a state file you store'],
      ],
    },
  ],
})
