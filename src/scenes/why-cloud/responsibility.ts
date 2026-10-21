import type { Scene, SceneNode } from '@graphlearning/flow'

// AWS's shared responsibility model: AWS secures the cloud itself, the customer secures what they
// put in it and how they configure it, and the line moves with the service.
// source: https://aws.amazon.com/compliance/shared-responsibility-model/
// source: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_UpgradeDBInstance.Maintenance.html
// source: https://docs.aws.amazon.com/lambda/latest/dg/runtimes-update.html
const chip = (id: string, label: string, pattern: SceneNode['pattern']): SceneNode => ({ id, label, variant: 'chip', pattern, icon: 'none' })

export const responsibility: Scene = {
  id: 'shared-responsibility',
  padding: 0.04,
  flow: 'LR',
  align: 'start',
  header: 'band',
  nodes: [
    {
      id: 'split',
      label: 'One line, two owners',
      bare: true,
      children: [
        {
          id: 'in',
          label: 'Security IN the cloud — you',
          pattern: 'user',
          icon: 'usercheck',
          cols: 2,
          children: [
            chip('in-iam', 'who may do what', 'user'),
            chip('in-data', 'your data, its encryption', 'user'),
            chip('in-net', 'network rules', 'user'),
            chip('in-code', 'application code', 'user'),
            chip('in-os', 'the OS on an EC2 server', 'user'),
            chip('in-config', 'every setting you choose', 'user'),
          ],
        },
        {
          id: 'of',
          label: 'Security OF the cloud — AWS',
          pattern: 'network',
          icon: 'awscloud',
          cols: 2,
          children: [
            chip('of-dc', 'data centres and guards', 'network'),
            chip('of-hw', 'hardware and disks', 'network'),
            chip('of-net', 'the global network', 'network'),
            chip('of-hv', 'the hypervisor', 'network'),
            chip('of-svc', 'managed-service software', 'network'),
            chip('of-regions', 'Regions and zones', 'network'),
          ],
        },
      ],
    },
    {
      id: 'detail',
      label: 'Where the line sits',
      bare: true,
      children: [
        {
          id: 'matrix',
          kind: 'table',
          label: 'Who patches and protects what',
          headers: ['', 'EC2', 'RDS', 'Lambda', 'S3'],
          values: [
            ['physical hardware', 'AWS', 'AWS', 'AWS', 'AWS'],
            ['operating system', 'you', 'AWS', 'AWS', '—'],
            ['database engine', 'you', 'AWS', '—', '—'],
            ['language runtime', 'you', '—', 'AWS', '—'],
            ['application code', 'you', 'you', 'you', '—'],
            ['who may call it', 'you', 'you', 'you', 'you'],
            ['data and encryption', 'you', 'you', 'you', 'you'],
          ],
        },
        {
          id: 'incidents',
          kind: 'list',
          icon: 'bell',
          label: 'Whose incident is it?',
          pattern: 'warn',
          items: [
            'A disk fails in the data centre — AWS',
            'A bucket is readable by anyone — you',
            'An EC2 server misses a security patch — you',
            'An RDS engine patch — AWS, in the window you set',
          ],
        },
      ],
    },
  ],
  edges: [],
}
