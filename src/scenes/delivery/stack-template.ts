import type { Scene } from '@graphlearning/flow'

// §9.2 — an annotated template for the order-events plumbing of Ch. 7 (topic → queue with a DLQ),
// linted with cfn-lint, and the creation order CloudFormation derives from its references (!Ref,
// !GetAtt): computed with a topological sort. Independent resources are created in parallel.
// source: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-attribute-dependson.html
export const stackTemplate: Scene = {
  id: 'stack-template',
  title: 'References decide the order',
  cols: 2,
  padding: 0.05,
  nodes: [
    {
      id: 'template',
      kind: 'code',
      filename: 'order-events.yaml · model-checked',
      hug: true,
      label: `AWSTemplateFormatVersion: "2010-09-09"
Description: Order events for the shop
Resources:
  OrderEventsTopic:
    Type: AWS::SNS::Topic
  OrderEventsDlq:
    Type: AWS::SQS::Queue
    Properties:
      MessageRetentionPeriod: 1209600   # 14 days
  OrderEventsQueue:
    Type: AWS::SQS::Queue
    Properties:
      VisibilityTimeout: 60
      RedrivePolicy:
        deadLetterTargetArn: !GetAtt OrderEventsDlq.Arn
        maxReceiveCount: 5
  QueuePolicy:
    Type: AWS::SQS::QueuePolicy
    Properties:
      Queues: [!Ref OrderEventsQueue]
      PolicyDocument:
        Version: "2012-10-17"
        Statement:
          - Effect: Allow
            Principal: { Service: sns.amazonaws.com }
            Action: sqs:SendMessage
            Resource: !GetAtt OrderEventsQueue.Arn
            Condition:
              ArnEquals: { aws:SourceArn: !Ref OrderEventsTopic }
  FulfilmentSubscription:
    Type: AWS::SNS::Subscription
    Properties:
      TopicArn: !Ref OrderEventsTopic
      Protocol: sqs
      Endpoint: !GetAtt OrderEventsQueue.Arn
      RawMessageDelivery: true
Outputs:
  QueueUrl:
    Value: !Ref OrderEventsQueue`,
    },
    {
      id: 'order',
      label: 'Creation order from references',
      pattern: 'group',
      cols: 1,
      children: [
        {
          id: 'waves',
          kind: 'code',
          filename: 'create_order.py · runs locally',
          hug: true,
          label: `from graphlib import TopologicalSorter

# each resource -> what it references (!Ref / !GetAtt) in the template
refs = {
    "OrderEventsTopic": [],
    "OrderEventsDlq": [],
    "OrderEventsQueue": ["OrderEventsDlq"],
    "QueuePolicy": ["OrderEventsQueue", "OrderEventsTopic"],
    "FulfilmentSubscription": ["OrderEventsTopic", "OrderEventsQueue"],
}
plan = TopologicalSorter(refs)
plan.prepare()
wave = 1
while plan.is_active():
    ready = sorted(plan.get_ready())
    print(f"wave {wave}: create", ", ".join(ready))
    plan.done(*ready)
    wave += 1
print("delete runs the same waves in reverse")`,
        },
        {
          id: 'waves-out',
          kind: 'code',
          filename: 'output',
          hug: true,
          label: `wave 1: create OrderEventsDlq, OrderEventsTopic
wave 2: create OrderEventsQueue
wave 3: create FulfilmentSubscription, QueuePolicy
delete runs the same waves in reverse`,
        },
      ],
    },
  ],
  edges: [],
}
