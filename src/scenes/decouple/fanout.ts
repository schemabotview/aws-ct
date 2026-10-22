import type { Scene } from '@graphlearning/flow'
import { BUILT_BY, mapFrame } from '../map'
import code from '../../../spine/decouple/05-fanout/project/infra/10-fanout.sh?raw'
import session from '../../../spine/decouple/05-fanout/session.txt?raw'

// SNS delivers a copy of each message to every subscription; an SQS subscriber's queue policy must
// allow sns.amazonaws.com with aws:SourceArn = the topic; RawMessageDelivery skips the JSON
// envelope; a filter policy on message attributes (numeric matching) drops messages that do not
// match for that subscription only.
// source: https://docs.aws.amazon.com/sns/latest/dg/subscribe-sqs-queue-to-sns-topic.html
// source: https://docs.aws.amazon.com/sns/latest/dg/sns-message-filtering.html
// source: https://docs.aws.amazon.com/sns/latest/dg/sns-large-payload-raw-message-delivery.html
export const fanout: Scene = mapFrame('sns-fanout', [...BUILT_BY[9], 'api', 'fn', 'queue', 'topic'], {
  id: 'fanout-pane',
  label: 'side',
  bare: true,
  children: [
    { id: 'fanout-sh', kind: 'code', filename: 'infra/10-fanout.sh', label: code.replace(/\n+$/, ''), show: [[5, 20]], highlight: [5, 11, 12, 13, 17, 18] },
    { id: 'fanout-run', kind: 'terminal', filename: 'Terminal — shop-on-aws · emulated', label: session.replace(/\n+$/, '') },
    {
      id: 'copies',
      kind: 'table',
      label: 'One publish, a copy per subscriber',
      headers: ['queue', 'filter', 'o-501 (29.00)', 'o-505 (640.00)'],
      values: [
        ['fulfilment', 'none', 'yes', 'yes'],
        ['loyalty', 'none', 'yes', 'yes'],
        ['fraud-check', 'total ≥ 500', 'no', 'yes'],
      ],
    },
  ],
})
