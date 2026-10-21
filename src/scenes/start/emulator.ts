import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { startTree } from './tree'
import code from '../../../spine/start/04-emulator/project/env.sh?raw'
import session from '../../../spine/start/04-emulator/session.txt?raw'

// What moto models and what it does not, as the course relies on it (AWS-COURSE-PLAN.md).
// source: https://docs.getmoto.org/en/latest/docs/server_mode.html
export const emulator: Scene = ideFrame(
  'emulator',
  'shop-on-aws',
  startTree('04', 'env.sh', ['env.sh', 'requirements.txt', 'catalog/p-1001.json']),
  { file: 'env.sh', code, highlight: [6, 7, 8], terminal: session },
  {
    id: 'emulator-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'shows',
        kind: 'list',
        icon: 'circlecheck',
        label: 'What the emulator shows',
        pattern: 'storage',
        items: ['API answers and errors', 'Resources and their state', 'IAM policy decisions', 'Queues, conditions and retries'],
      },
      {
        id: 'cannot',
        kind: 'list',
        icon: 'circleslash',
        label: 'What it cannot show',
        pattern: 'warn',
        items: ['Packets crossing a network', 'Software running on a server', 'SCPs and cross-account checks', 'Failover, edge caches, quotas'],
      },
      {
        id: 'rules',
        kind: 'list',
        icon: 'terminal',
        label: 'How the course uses it',
        pattern: 'network',
        items: [
          'The real CLI and boto3; only the endpoint changes',
          'Every pane run against it says “emulated”',
          'What it cannot show is a model or a cited doc',
          'Its identity is a placeholder: user/moto',
        ],
      },
    ],
  },
)
