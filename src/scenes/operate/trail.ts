import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { operateTree } from './tree'
import code from '../../../spine/operate/03-trail/project/ops/who_changed.py?raw'
import session from '../../../spine/operate/03-trail/session.txt?raw'

// CloudTrail records API calls: management events by default (90 days of event history without a
// trail); data events (e.g. S3 object-level) only when selected on a trail, at extra cost; a trail
// delivers to S3 for longer retention. CloudWatch holds runtime metrics and logs. The record file
// is an example in CloudTrail's record format (shape from the docs), not a captured log.
// source: https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-concepts.html
// source: https://docs.aws.amazon.com/awscloudtrail/latest/userguide/logging-data-events-with-cloudtrail.html
// source: https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference-record-contents.html
export const trail: Scene = ideFrame(
  'cloudtrail-evidence',
  'shop-on-aws',
  operateTree('03', 'ops/who_changed.py', ['ops/who_changed.py', 'ops/evidence', 'infra/12-trail.sh', 'infra/trail']),
  { file: 'ops/who_changed.py', code, highlight: [8, 9, 11, 12, 14], terminal: session },
  {
    id: 'trail-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'which-evidence',
        kind: 'table',
        label: 'Which records what',
        headers: ['question', 'look in'],
        values: [
          ['is checkout slow?', 'CloudWatch metrics'],
          ['what did the app log?', 'CloudWatch Logs'],
          ['who changed a policy?', 'CloudTrail'],
          ['who read a report?', 'CloudTrail data events'],
        ],
      },
      {
        id: 'trail-rules',
        kind: 'list',
        icon: 'cloudtrail',
        label: 'Evidence that lasts',
        pattern: 'network',
        items: [
          'Event history: 90 days, no trail',
          'A trail keeps it in S3, for years',
          'Data events: only where selected',
          'The record here is an example',
        ],
      },
    ],
  },
)
