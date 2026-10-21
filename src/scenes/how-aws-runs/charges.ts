import type { Scene } from '@graphlearning/flow'

// The shop's HYPOTHETICAL rate card (CLAUDE.md), always labelled as such. The meters are AWS's:
// EC2 bills while running; an EBS volume bills for provisioned GB-months whether attached or not;
// a public IPv4 address bills per hour; data in from the internet is not charged.
// source: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-instance-lifecycle.html
// source: https://docs.aws.amazon.com/vpc/latest/userguide/vpc-ip-addressing.html
// source: https://docs.aws.amazon.com/cost-management/latest/userguide/ce-what-is.html
// The dev account, per month (CLAUDE.md's dev ledger): 20 GB volume 1.60 + public IPv4 3.65 + 20 GB
// snapshot 1.00 + 33 GB in S3 0.76 = 7.01 stopped; running adds 730 h × $0.04 = 29.20 → 36.21.
export const charges: Scene = {
  id: 'what-keeps-charging',
  padding: 0.04,
  flow: 'LR',
  align: 'start',
  header: 'band',
  nodes: [
    {
      id: 'left',
      label: 'Meters',
      bare: true,
      children: [
        {
          id: 'meters',
          kind: 'table',
          label: 'The meters, at the course’s hypothetical rates',
          headers: ['resource', 'billed by', 'hypothetical rate', 'while stopped'],
          values: [
            ['EC2 instance', 'the hour, while running', '$0.04 / h', 'nothing'],
            ['EBS volume', 'GB-month provisioned', '$0.08 / GB-month', 'still billed'],
            ['public IPv4 address', 'the hour, while held', '$0.005 / h', 'still billed'],
            ['EBS snapshot', 'GB-month stored', '$0.05 / GB-month', 'still billed'],
            ['S3 object storage', 'GB-month stored, + requests', '$0.023 / GB-month', 'not a server'],
            ['data out to the internet', 'GB transferred', '$0.09 / GB', 'only when sent'],
            ['data in from the internet', '—', 'free', '—'],
          ],
        },
        {
          id: 'shapes',
          kind: 'list',
          icon: 'receipt',
          label: 'Three shapes of a bill',
          pattern: 'external',
          items: ['Per hour: servers, addresses, gateways', 'Per GB: storage, and data leaving', 'Per request: API calls to S3, queues, functions', 'Course 3 prices the shop’s own dev account'],
        },
      ],
    },
    {
      id: 'stopped',
      label: 'The dev account, one month',
      bare: true,
      children: [
        {
          id: 'month',
          kind: 'table',
          label: 'Stopping is not deleting',
          headers: ['item', 'running', 'stopped'],
          values: [
            ['instance, 730 h', '$29.20', '$0.00'],
            ['volume, 20 GB', '$1.60', '$1.60'],
            ['public IPv4, 730 h', '$3.65', '$3.65'],
            ['snapshot, 20 GB', '$1.00', '$1.00'],
            ['S3, 33 GB', '$0.76', '$0.76'],
            ['total', '$36.21', '$7.01'],
          ],
        },
      ],
    },
  ],
  edges: [],
}
