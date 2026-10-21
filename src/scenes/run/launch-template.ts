import type { Scene } from '@graphlearning/flow'
import { BUILT_BY, mapFrame } from '../map'
import code from '../../../spine/run/03-template/project/infra/06-template.sh?raw'
import session from '../../../spine/run/03-template/session.txt?raw'

// A launch template holds an instance's configuration (AMI, type, profile, security groups, metadata
// options) as numbered versions. HttpTokens=required enforces IMDSv2. Lifecycle: pending → running →
// stopping → stopped → shutting-down → terminated. The AMI id comes from AWS's public SSM parameter.
// The emulator reports a new instance as running at once and does not apply the template's metadata
// options to it, so the template is read back instead.
// source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-launch-templates.html
// source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-lifecycle.html
// source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/configuring-instance-metadata-service.html
export const launchTemplate: Scene = mapFrame('launch-template', [...BUILT_BY[5], 'app'], {
  id: 'template-pane',
  label: 'side',
  bare: true,
  children: [
    { id: 'template-script', kind: 'code', filename: 'infra/06-template.sh', label: code.replace(/\n+$/, ''), show: [[5, 16]], highlight: [5, 6, 13, 14, 16] },
    { id: 'template-run', kind: 'terminal', filename: 'Terminal — shop-on-aws · emulated', label: session.replace(/\n+$/, '') },
    {
      id: 'lifecycle',
      kind: 'table',
      label: 'An instance’s lifecycle',
      headers: ['state', 'billed', 'its disk'],
      values: [
        ['pending → running', 'yes, from running', 'attached'],
        ['stopping → stopped', 'no instance hours', 'kept, and billed'],
        ['shutting-down → terminated', 'no', 'deleted (by default)'],
      ],
    },
  ],
})
