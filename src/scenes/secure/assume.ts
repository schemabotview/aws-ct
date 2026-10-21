import type { Scene } from '@graphlearning/flow'
import { BUILT_BY, mapFrame } from '../map'
import session from '../../../spine/secure/04-assume-role/session.txt?raw'

// AssumeRole returns temporary credentials (an ASIA… key, a secret and a session token), valid for
// an hour by default. On EC2, the instance profile makes EC2 assume the role and serve the
// credentials to the server through the instance metadata service, refreshing them before expiry.
// The emulator, with IAM enforcement off, does not check the trust policy: on AWS only EC2 may
// make this call for OrderApi.
// source: https://docs.aws.amazon.com/STS/latest/APIReference/API_AssumeRole.html
// source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/iam-roles-for-amazon-ec2.html
export const assume: Scene = mapFrame('assume-role', [...BUILT_BY[3], 'iam', 'accounts'], {
  id: 'assume-pane',
  label: 'side',
  bare: true,
  children: [
    { id: 'assume-run', kind: 'terminal', filename: 'Terminal — shop-on-aws · emulated', label: session.replace(/\n+$/, '') },
    {
      id: 'creds',
      kind: 'table',
      label: 'What a server holds instead of a key',
      headers: ['', 'access key (IAM user)', 'role session (OrderApi)'],
      values: [
        ['key id', 'AKIA…', 'ASIA…, plus a session token'],
        ['lifetime', 'until someone rotates it', 'one hour here, then refreshed'],
        ['identity', 'user/…', 'assumed-role/OrderApi/app-b'],
        ['if leaked', 'works until found', 'stops working at expiry'],
      ],
    },
    {
      id: 'emulated-trust',
      kind: 'list',
      icon: 'circleslash',
      label: 'What the emulator skipped',
      pattern: 'warn',
      items: [
        'Enforcement is off here, so the trust policy was not checked',
        'On AWS, only EC2 may assume OrderApi: this call by a person is refused',
        'On a server, EC2 makes the call and hands over the credentials',
      ],
    },
  ],
})
