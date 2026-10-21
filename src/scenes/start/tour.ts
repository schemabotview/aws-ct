import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'

// The finished project as AWS-COURSE-PLAN.md describes it. Nothing here runs yet — this frame is the
// map, so the editor's place holds what each part is for, not code.
export const tour: Scene = ideFrame(
  'project-tour',
  'shop-on-aws',
  [
    { name: '.venv', folder: true, state: 'muted', note: 'boto3' },
    { name: 'app', folder: true, note: 'the order API' },
    { name: 'catalog', folder: true, note: 'product JSON' },
    { name: 'db', folder: true, note: 'PostgreSQL' },
    { name: 'docs', folder: true, note: 'ADR-007' },
    { name: 'functions', folder: true, note: 'Lambda' },
    { name: 'infra', folder: true, note: 'CLI scripts' },
    { name: 'jobs', folder: true, note: 'export, report' },
    { name: 'ops', folder: true, note: 'runbooks' },
    { name: 'pipeline', folder: true, note: 'build, deploy' },
    { name: 'policies', folder: true, note: 'IAM JSON' },
    { name: 'templates', folder: true, note: 'CloudFormation' },
    { name: 'tools', folder: true, note: 'calculations' },
    { name: 'workflow', folder: true, note: 'Step Functions' },
    { name: 'env.sh', state: 'active' },
    { name: 'requirements.txt' },
  ],
  {
    id: 'parts',
    kind: 'table',
    label: 'What each part is for, and where we build it',
    headers: ['part', 'its job', 'course'],
    values: [
      ['env.sh, .venv/', 'Region, emulator, boto3', '3'],
      ['infra/', 'the AWS CLI scripts that build it', '3 → 6'],
      ['policies/', 'who may do what, as JSON', '4 → 12'],
      ['app/', 'the order API, and its image', '6 → 9'],
      ['templates/', 'the same resources, declared', '7 → 12'],
      ['pipeline/', 'build once, deploy to two accounts', '7'],
      ['catalog/, db/', 'products and the orders schema', '3, 9'],
      ['functions/, workflow/', 'the asynchronous checkout', '10'],
      ['jobs/', 'export, reconcile, report', '11'],
      ['ops/', 'runbooks for incidents and restores', '12'],
      ['tools/', 'costs, capacity, CIDR plans', '3 → 13'],
      ['docs/', 'the decision record', '13'],
    ],
  },
  {
    id: 'legend',
    kind: 'list',
    icon: 'folder',
    label: 'Reading every lesson',
    sub: 'the same panels, always',
    pattern: 'network',
    items: [
      'Left: the project, as your editor shows it',
      'NEW marks a file this lesson adds',
      'Centre: the file, this lesson’s lines highlighted',
      'Below it: the terminal, exactly as it ran',
      '· emulated: run against the local emulator, not AWS',
      '··· N lines folds what this lesson does not need',
    ],
  },
)
