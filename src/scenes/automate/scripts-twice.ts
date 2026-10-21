import type { Scene } from '@graphlearning/flow'
import { BUILT_BY, mapFrame } from '../map'
import session from '../../../spine/automate/01-scripts-twice/session.txt?raw'

// CreateVpc does not check for an existing VPC with the same Name tag, so the script makes a second
// one; the next script looks the VPC up by name, gets the first of two, and collides with the
// security groups it already holds (InvalidGroup.Duplicate).
// source: https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateVpc.html
// source: https://docs.aws.amazon.com/AWSEC2/latest/APIReference/API_CreateSecurityGroup.html
export const scriptsTwice: Scene = mapFrame('scripts-twice', BUILT_BY[6], {
  id: 'twice-pane',
  label: 'side',
  bare: true,
  children: [
    { id: 'twice-run', kind: 'terminal', filename: 'Terminal — shop-on-aws · emulated', label: session.replace(/\n+$/, '') },
    {
      id: 'what-broke',
      kind: 'table',
      label: 'Run the whole network twice',
      headers: ['script', 'second run', 'why'],
      values: [
        ['05-network.sh', 'a second VPC and nine subnets', 'CreateVpc never asks what exists'],
        ['describe-vpcs', 'two VPCs called shop-prod', 'a name tag is not an identity'],
        ['05-filters.sh', 'InvalidGroup.Duplicate', 'it picked the first VPC, already full'],
      ],
    },
    {
      id: 'scripts-say',
      kind: 'list',
      icon: 'repeat',
      label: 'What a script cannot say',
      pattern: 'warn',
      items: [
        'It records steps to take, not the result wanted',
        'Run twice, it does the steps twice — or fails half way',
        'Nothing records what it made, so nothing can safely change or remove it',
      ],
    },
  ],
})
