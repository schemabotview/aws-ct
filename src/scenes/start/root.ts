import type { Scene, SceneNode } from '@graphlearning/flow'

// The root user has complete access to every resource and setting in its account, and a few tasks
// need it. AWS recommends MFA on it, no access keys for it, and using it only for those tasks; in an
// organization, member accounts can have their root credentials removed (centralised root access).
// source: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_root-user.html
// source: https://docs.aws.amazon.com/IAM/latest/UserGuide/root-user-tasks.html
// source: https://docs.aws.amazon.com/IAM/latest/UserGuide/id_root-user.html#id_root-user-access-management
const who = (id: string, label: string, sub: string, icon: string, pattern: SceneNode['pattern']): SceneNode => ({ id, label, sub, icon, pattern })

export const root: Scene = {
  id: 'root-user',
  padding: 0.04,
  flow: 'LR',
  align: 'start',
  header: 'band',
  nodes: [
    {
      id: 'account',
      label: 'Account 444455556666 · shop dev',
      icon: 'awscloud',
      pattern: 'network',
      cols: 1,
      children: [
        who('root', 'Root user', 'the email that opened the account: can do anything, cannot be limited by IAM', 'skull', 'warn'),
        who('people', 'alex, sam', 'people, through IAM Identity Center — Course 4', 'usercheck', 'user'),
        who('roles', 'OrderApi', 'a role for the app itself — Course 4', 'iam', 'user'),
      ],
    },
    {
      id: 'root-side',
      label: 'Root',
      bare: true,
      children: [
        {
          id: 'tasks',
          kind: 'table',
          label: 'The few jobs that need root',
          headers: ['job', 'why only root'],
          values: [
            ['change the account’s email, name or root password', 'they define the account'],
            ['close the account', 'nothing else may end it'],
            ['restore access when no admin can sign in', 'the last way back in'],
            ['some billing and tax settings', 'reserved by AWS'],
          ],
        },
        {
          id: 'lock',
          kind: 'list',
          icon: 'lock',
          label: 'Lock it away',
          pattern: 'warn',
          items: [
            'Turn on MFA for root before anything else',
            'Never create access keys for root',
            'Sign in as root only for the jobs above',
            'Everyday work goes through Identity Center',
            'In an organization, member accounts can have no root password at all',
          ],
        },
      ],
    },
  ],
  edges: [],
}
