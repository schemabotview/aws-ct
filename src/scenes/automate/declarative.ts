import type { Scene } from '@graphlearning/flow'

// CloudFormation compares a template (desired state) with the stack's resources and works out the
// calls; it orders them by dependency and records which physical resources belong to the stack.
// source: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html
// source: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/stacks.html
const SCRIPT = [
  'VPC=$(aws ec2 create-vpc --cidr-block 10.20.0.0/16 …)',
  'subnet public-a a 10.20.0.0/24',
  'subnet public-b b 10.20.1.0/24',
  '…',
].join('\n')
const TEMPLATE = [
  'Vpc:',
  '  Type: AWS::EC2::VPC',
  '  Properties: {CidrBlock: 10.20.0.0/16}',
  'PublicA:',
  '  Type: AWS::EC2::Subnet',
  '  Properties: {VpcId: !Ref Vpc, CidrBlock: 10.20.0.0/24}',
].join('\n')

export const declarative: Scene = {
  id: 'declarative-vs-imperative',
  padding: 0.04,
  flow: 'LR',
  align: 'start',
  header: 'band',
  nodes: [
    {
      id: 'two-ways',
      label: 'The same network, two ways',
      bare: true,
      children: [
        { id: 'imperative', kind: 'code', filename: 'steps to take: 05-network.sh · illustrative', label: SCRIPT, pattern: 'warn' },
        { id: 'declared', kind: 'code', filename: 'the result wanted: network.yaml · illustrative', label: TEMPLATE, pattern: 'storage' },
      ],
    },
    {
      id: 'what-differs',
      label: 'What differs',
      bare: true,
      children: [
        {
          id: 'compare',
          kind: 'table',
          label: 'Script or template',
          headers: ['', 'script', 'template'],
          values: [
            ['says', 'what to do', 'what should exist'],
            ['run twice', 'does it twice', 'no changes'],
            ['knows what it made', 'no', 'the stack does'],
            ['order', 'as written', 'from the references'],
            ['remove it all', 'a teardown script', 'delete the stack'],
          ],
        },
        {
          id: 'principles',
          kind: 'list',
          icon: 'cloudformation',
          label: 'What a stack holds',
          pattern: 'service',
          items: [
            'Desired state: the template, reviewed like code',
            'Ownership: every resource it made, recorded',
            'Dependencies: !Ref and !GetAtt decide the order',
            'Repeatability: the same template, any account, any time',
          ],
        },
      ],
    },
  ],
  edges: [],
}
