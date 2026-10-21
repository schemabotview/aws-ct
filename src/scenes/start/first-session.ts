import type { Scene } from '@graphlearning/flow'
import { mapFrame } from '../map'
import session from '../../../spine/start/03-first-session/session.txt?raw'

// The real AWS CLI, with the shop's SSO profile and no login yet: it refuses before any request is
// sent, so nothing here is emulated. `aws sso login` needs a browser and IAM Identity Center, which
// the emulator does not have; its steps and the answer after it are AWS's documentation, and the
// response is shape-checked against the STS model with invented values.
// source: https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html
// source: https://docs.aws.amazon.com/singlesignon/latest/userguide/howtosessionduration.html
export const firstSession: Scene = mapFrame('first-session', ['shopper'], {
  id: 'first-session-pane',
  label: 'side',
  bare: true,
  children: [
    { id: 'no-login', kind: 'terminal', filename: 'Terminal — ~ · the real CLI, before logging in', label: session.replace(/\n+$/, '') },
    {
      id: 'login',
      kind: 'table',
      label: 'aws sso login --profile shop-dev, step by step',
      headers: ['step', 'what happens'],
      values: [
        ['1', 'a browser opens the shop’s access portal'],
        ['2', 'alex signs in, with MFA, and approves the CLI'],
        ['3', 'the CLI caches a token in ~/.aws/sso/cache'],
        ['4', 'each command trades it for ShopDeveloper role credentials'],
        ['5', 'they expire: no long-lived key on the laptop'],
      ],
    },
    {
      id: 'after',
      kind: 'code',
      filename: 'sts.GetCallerIdentity.json · model-checked',
      label: '{\n  "UserId": "AROAEXAMPLEID7SHOPDEV:alex",\n  "Account": "444455556666",\n  "Arn": "arn:aws:sts::444455556666:assumed-role/AWSReservedSSO_ShopDeveloper_0a1b2c3d4e5f6a7b/alex"\n}',
    },
  ],
})
