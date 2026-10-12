import type { Scene } from '@graphlearning/flow'

// §4.4 — bootstrap and operational access. User data runs once at first boot (bash, syntax-checked);
// the instance pulls its release from S3 through the instance profile and logs to CloudWatch Logs.
// Session Manager gives a shell over the SSM agent with no inbound port and no SSH key; patching runs
// the AWS-RunPatchBaseline document against instances by tag. Patching the guest OS stays ours.
// source: https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html
// source: https://docs.aws.amazon.com/systems-manager/latest/userguide/patch-manager.html
export const bootstrapAndSsm: Scene = {
  id: 'bootstrap-and-ssm',
  title: 'First boot, then hands-off access',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'userdata',
      kind: 'code',
      filename: 'user-data.sh · model-checked',
      hug: true,
      label: `#!/bin/bash
set -euo pipefail
# runs once, as root, on first boot
dnf install -y java-21-amazon-corretto amazon-cloudwatch-agent
aws s3 cp s3://shop-releases-111122223333/order-api-1.4.2.jar \\
  /opt/order-api/app.jar
# ship /var/log/order-api/*.log to CloudWatch Logs
/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \\
  -a fetch-config -m ec2 -s -c ssm:/shop/cw-agent
systemctl enable --now order-api`,
    },
    {
      id: 'ops',
      kind: 'code',
      filename: 'operate.sh · model-checked',
      hug: true,
      label: `# a shell without SSH keys or an open port 22
aws ssm start-session --target i-0a1b2c3d4e5f60001
# patch every order-api server, by tag
aws ssm send-command --document-name AWS-RunPatchBaseline \\
  --targets Key=tag:App,Values=order-api \\
  --parameters Operation=Install`,
    },
    {
      id: 'duties',
      kind: 'list',
      framed: true,
      label: 'Still ours on EC2',
      icon: 'wrench',
      pattern: 'warn',
      items: [
        'patch the OS and the Java runtime',
        'rotate to a new AMI, not hand fixes',
        'keep the log agent configured',
        'least-privilege instance role (Ch. 2)',
      ],
    },
  ],
  edges: [],
}
