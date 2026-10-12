import type { Scene } from '@graphlearning/flow'

// §4.2 — an annotated launch template for the order API's app servers (validated in full against
// the EC2 CreateLaunchTemplate request shape), beside the instance lifecycle. IMDSv2 is required
// (HttpTokens=required); the instance profile is Chapter 2's OrderApi. The AMI id is a placeholder.
// source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-lifecycle.html
export const launchTemplate: Scene = {
  id: 'launch-template',
  title: 'A launch template, and an instance’s life',
  cols: 2,
  padding: 0.05,
  nodes: [
    {
      id: 'template',
      kind: 'code',
      filename: 'ec2.CreateLaunchTemplate.request.json · model-checked',
      hug: true,
      label: `{
  "LaunchTemplateName": "order-api",
  "VersionDescription": "v14: app 1.4.2",
  "LaunchTemplateData": {
    "ImageId": "ami-0abc1234def567890",
    "InstanceType": "m7g.large",
    "IamInstanceProfile": { "Name": "OrderApi" },
    "SecurityGroupIds": ["sg-app"],
    "MetadataOptions": {
      "HttpTokens": "required",
      "HttpEndpoint": "enabled"
    },
    "UserData": "IyEvYmluL2Jhc2gKLi4u",
    "TagSpecifications": [{
      "ResourceType": "instance",
      "Tags": [
        { "Key": "App", "Value": "order-api" },
        { "Key": "Env", "Value": "prod" }
      ]
    }]
  }
}`,
    },
    {
      id: 'lifecycle',
      label: 'Instance states',
      pattern: 'group',
      flow: 'TB',
      children: [
        { id: 's-pending', label: 'pending', sub: 'launching', pattern: 'external', icon: 'clock' },
        { id: 's-running', label: 'running', sub: 'billed per second', pattern: 'service', icon: 'ec2' },
        { id: 's-stopped', label: 'stopped', sub: 'volumes still billed', pattern: 'storage', icon: 'ebs' },
        { id: 's-terminated', label: 'terminated', sub: 'gone; not restartable', pattern: 'warn', icon: 'trash' },
      ],
      edges: [
        { source: 's-pending', target: 's-running' },
        { source: 's-running', target: 's-stopped', label: 'stop' },
        { source: 's-stopped', target: 's-terminated', label: 'terminate' },
      ],
    },
  ],
  edges: [],
}
