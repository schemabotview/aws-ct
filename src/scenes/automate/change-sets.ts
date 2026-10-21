import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { automateTree } from './tree'
import code from '../../../spine/automate/05-change-sets/project/tools/replacement_preview.py?raw'
import session from '../../../spine/automate/05-change-sets/session.txt?raw'

// A change set lists each resource's Action and Replacement (True / False / Conditional) before
// anything changes; it cannot promise the update will succeed. Drift detection compares resources
// with the template. The preview here reads AWS's own resource schemas (createOnlyProperties), as
// shipped with cfn-lint, because the emulator's change sets carry no replacement detail. Widening a
// VPC without replacing it is a secondary block (AWS::EC2::VPCCidrBlock).
// source: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-changesets.html
// source: https://docs.aws.amazon.com/cloudformation-cli/latest/userguide/resource-type-schema.html
// source: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-stack-drift.html
export const changeSets: Scene = ideFrame(
  'change-sets',
  'shop-on-aws',
  automateTree('05', 'tools/replacement_preview.py', ['tools/replacement_preview.py']),
  { file: 'tools/replacement_preview.py', code, show: [[21, 35]], highlight: [21, 27, 28, 29, 31], terminal: session, emulated: false },
  {
    id: 'change-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'limits',
        kind: 'table',
        label: 'What a change set can tell you',
        headers: ['tells you', 'cannot tell you'],
        values: [
          ['which resources change', 'whether a call will fail'],
          ['which are replaced', 'what data moves with them'],
          ['the order of changes', 'what the app does meanwhile'],
        ],
      },
      {
        id: 'widen',
        kind: 'list',
        icon: 'layers',
        label: 'One line, ten replacements',
        pattern: 'warn',
        items: [
          'CidrBlock is create-only: a new VPC',
          'Every subnet names it: nine more',
          'Safer: add a secondary CIDR block',
          'Drift: what changed outside the stack',
        ],
      },
    ],
  },
)
