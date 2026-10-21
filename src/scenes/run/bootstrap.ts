import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { runTree } from './tree'
import code from '../../../spine/run/05-bootstrap/project/app/user-data.sh?raw'
import session from '../../../spine/run/05-bootstrap/session.txt?raw'

// User data runs once as root at first boot (cloud-init). Systems Manager Run Command and Session
// Manager reach instances through the SSM agent and an instance role, with no inbound port and no
// SSH key. The emulator records send-command and runs nothing.
// source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html
// source: https://docs.aws.amazon.com/systems-manager/latest/userguide/run-command.html
// source: https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager.html
export const bootstrap: Scene = ideFrame(
  'bootstrap-and-ssm',
  'shop-on-aws',
  runTree('05', 'app/user-data.sh', ['app/user-data.sh']),
  { file: 'app/user-data.sh', code, show: [[4, 19]], highlight: [6, 7, 8, 9, 19], terminal: session },
  {
    id: 'bootstrap-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'ssm',
        kind: 'table',
        label: 'Reaching a server without SSH',
        headers: ['need', 'Systems Manager'],
        values: [
          ['run a command on many', 'Run Command'],
          ['a shell on one', 'Session Manager'],
          ['patch on a schedule', 'Patch Manager'],
          ['inbound port 22', 'none'],
        ],
      },
      {
        id: 'still-ours',
        kind: 'list',
        icon: 'wrench',
        label: 'Still ours on EC2',
        pattern: 'service',
        items: [
          'The OS and its security patches',
          'The Python runtime and boto3',
          'Starting, restarting, logging the app',
          'The emulator records send-command; it runs nothing',
        ],
      },
    ],
  },
)
