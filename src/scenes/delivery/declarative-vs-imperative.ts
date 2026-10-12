import type { Scene } from '@graphlearning/flow'

// §9.1 — the same dead-letter queue built two ways: a script of commands (what to DO, in order) and a
// declaration (what should EXIST). The stack owns what it declares, so it can create, update and
// delete it as a unit and reproduce it in another account. CLI parameters model-checked; the
// template linted with cfn-lint.
// source: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html
export const declarativeVsImperative: Scene = {
  id: 'declarative-vs-imperative',
  title: 'Steps to run, or a state to reach',
  cols: 1,
  padding: 0.12,
  nodes: [
    {
      id: 'script',
      kind: 'code',
      filename: 'make-queues.sh · model-checked',
      hug: true,
      label: `# imperative: run once, in order
aws sqs create-queue --queue-name order-events-dlq
DLQ_ARN=$(aws sqs get-queue-attributes \\
  --queue-url "$DLQ_URL" \\
  --attribute-names QueueArn \\
  --query Attributes.QueueArn --output text)
aws sqs create-queue --queue-name order-events \\
  --attributes file://redrive.json
# run it twice: the second create may fail or
# silently differ; nothing records ownership`,
    },
    {
      id: 'template',
      kind: 'code',
      filename: 'dlq.yaml · model-checked',
      hug: true,
      label: `AWSTemplateFormatVersion: "2010-09-09"
Resources:
  OrderEventsDlq:
    Type: AWS::SQS::Queue
  OrderEventsQueue:
    Type: AWS::SQS::Queue
    Properties:
      RedrivePolicy:
        deadLetterTargetArn: !GetAtt OrderEventsDlq.Arn
        maxReceiveCount: 5`,
    },
    {
      id: 'outcome',
      label: 'Why declare',
      pattern: 'group',
      cols: 2,
      children: [
    {
      id: 'compare',
      kind: 'table',
      label: 'What the declaration adds',
      sub: 'same two queues',
      headers: ['', 'script', 'stack'],
      values: [
        ['run it again', 'errors or drift', 'no change'],
        ['who owns them', 'nobody records', 'the stack'],
        ['delete them', 'remember each', 'delete the stack'],
        ['another account', 'edit and rerun', 'same template'],
      ],
    },
    {
      id: 'principles',
      kind: 'list',
      framed: true,
      label: 'Declarative infrastructure',
      icon: 'cloudformation',
      pattern: 'service',
      items: [
        'describe the end state, not the steps',
        'the engine works out order from references',
        'one owner per resource: its stack',
        'the template is reviewed like code',
      ],
    },
      ],
    },
  ],
  edges: [],
}
