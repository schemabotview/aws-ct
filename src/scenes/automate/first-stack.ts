import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { automateTree } from './tree'
import code from '../../../spine/automate/03-first-stack/project/templates/network.yaml?raw'
import session from '../../../spine/automate/03-first-stack/session.txt?raw'

// `aws cloudformation deploy` creates a change set and executes it; with nothing to change it says
// so and exits 0. !GetAZs lists the Region's AZs, so the template names none (cfn-lint W3010).
// source: https://docs.aws.amazon.com/cli/latest/reference/cloudformation/deploy/
// source: https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/intrinsic-function-reference-getavailabilityzones.html
export const firstStack: Scene = ideFrame(
  'first-stack',
  'shop-on-aws',
  automateTree('03', 'templates/network.yaml', ['templates/network.yaml']),
  { file: 'templates/network.yaml', code, show: [[3, 18]], highlight: [4, 5, 7, 11, 12], terminal: session },
  {
    id: 'stack-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'deploy-twice',
        kind: 'table',
        label: 'Deploy twice',
        headers: ['run', 'what happens'],
        values: [
          ['first', '10 resources created'],
          ['second', 'no changes to deploy'],
          ['after an edit', 'only the difference'],
        ],
      },
      {
        id: 'stack-facts',
        kind: 'list',
        icon: 'cloudformation',
        label: 'A stack, not a script',
        pattern: 'service',
        items: [
          'cfn-lint checks it before AWS sees it',
          '!Ref Vpc: the subnets wait for the VPC',
          '!GetAZs: no zone is hard-coded',
          'Delete the stack: all ten go, in order',
        ],
      },
    ],
  },
)
