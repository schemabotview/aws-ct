import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { runTree } from './tree'
import code from '../../../spine/run/07-containers/project/app/task-definition.json?raw'
import session from '../../../spine/run/07-containers/session.txt?raw'

// A Fargate task definition names the image, CPU and memory, architecture, and two roles: the
// execution role (pull the image, write logs) and the task role (what the app's code may call).
// stopTimeout is how long ECS waits after SIGTERM before SIGKILL.
// source: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html
// source: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_execution_IAM_role.html
// source: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-iam-roles.html
export const ecs: Scene = ideFrame(
  'ecs-task',
  'shop-on-aws',
  runTree('07', 'app/task-definition.json', ['app/Dockerfile', 'app/task-definition.json']),
  { file: 'app/task-definition.json', code, show: [[2, 17]], highlight: [5, 6, 7, 9, 10, 16], terminal: session },
  {
    id: 'ecs-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'vm-container',
        kind: 'table',
        label: 'Server or task',
        headers: ['', 'EC2', 'Fargate'],
        values: [
          ['unit', 'a server', 'a task'],
          ['built from', 'AMI + user data', 'an image'],
          ['OS patches', 'yours', 'AWS’s'],
          ['size', 'm7g.large', '0.5 vCPU, 1 GiB'],
        ],
      },
      {
        id: 'two-roles',
        kind: 'list',
        icon: 'iam',
        label: 'Two roles, two jobs',
        pattern: 'user',
        items: [
          'OrderApiExecution: ECS pulls the image, writes logs',
          'OrderApi: what the app itself may call, as before',
          'stopTimeout 30: SIGTERM, then 30 s, then SIGKILL',
        ],
      },
    ],
  },
)
