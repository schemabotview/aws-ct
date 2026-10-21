import type { Scene, SceneNode } from '@graphlearning/flow'

// Who runs what, from a server you own to a fully managed queue. The split for each service follows
// AWS's own descriptions: RDS applies OS and engine patches in the maintenance window you choose;
// Lambda runs on managed runtimes AWS patches; SQS has no servers to see at all.
// source: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_UpgradeDBInstance.Maintenance.html
// source: https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html
// source: https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html
const stage = (id: string, label: string, sub: string, icon: string, pattern: SceneNode['pattern'], you: string[], aws: string[]): SceneNode => ({
  id,
  label,
  sub,
  icon,
  pattern,
  cols: 1,
  children: [
    { id: `${id}-you`, kind: 'list', label: 'You run', icon: 'usercheck', pattern: 'user', items: you },
    { id: `${id}-aws`, kind: 'list', label: 'AWS runs', icon: 'awscloud', pattern: 'network', items: aws },
  ],
})

export const managed: Scene = {
  id: 'managed-services',
  padding: 0.04,
  header: 'band',
  nodes: [
    {
      id: 'ladder',
      label: 'The line moves right, one service at a time',
      bare: true,
      flow: 'LR',
      align: 'start',
      stretch: true,
      children: [
        stage('own', 'Your own server', 'you run everything', 'server', 'service',
          ['Building, power, network', 'The hardware', 'The operating system', 'The database software', 'Your code and data'], ['Nothing']),
        stage('ec2', 'EC2', 'a virtual machine', 'ec2', 'service',
          ['The operating system and patches', 'The database software', 'How many servers', 'Your code and data'], ['Building and hardware', 'The hypervisor']),
        stage('rds', 'RDS', 'a managed database', 'rds', 'storage',
          ['Size, backups, patch window', 'Tables, queries, connections', 'Your data'], ['Hardware and OS', 'Engine install and patches', 'Backups and failover']),
        stage('lambda', 'Lambda', 'functions, no servers', 'lambda', 'service',
          ['Your function code', 'Memory, timeout, permissions'], ['Servers and OS', 'Runtime patches', 'Scaling per request']),
        stage('sqs', 'SQS', 'a queue as a service', 'sqs', 'network',
          ['Settings and who may use it', 'Your messages'], ['Storing and delivering them', 'Everything underneath']),
      ],
      edges: [
        { source: 'own', target: 'ec2' },
        { source: 'ec2', target: 'rds' },
        { source: 'rds', target: 'lambda' },
        { source: 'lambda', target: 'sqs' },
      ],
    },
    {
      id: 'trade-row',
      label: 'The trade',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        {
          id: 'trade',
          kind: 'table',
          label: 'What moving right buys, and costs',
          headers: ['', 'more managed'],
          values: [
            ['jobs you do', 'fewer'],
            ['control', 'less: versions, OS access, tuning'],
            ['limits', 'the service’s, documented as quotas'],
            ['paying', 'closer to use: per request, per GB'],
          ],
        },
        {
          id: 'shop-uses',
          kind: 'list',
          icon: 'package',
          label: 'Where the shop uses each',
          pattern: 'user',
          items: ['EC2 for the app servers — Course 6', 'RDS for the orders — Course 9', 'Lambda and SQS for the checkout — Course 10', 'S3 for files, fully managed — Course 8'],
        },
      ],
    },
  ],
  edges: [],
}
