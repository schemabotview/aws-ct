import type { Scene } from '@graphlearning/flow'
import { BUILT_BY, mapFrame } from '../map'
import code from '../../../spine/decouple/06-events/project/infra/10-events.sh?raw'
import session from '../../../spine/decouple/06-events/session.txt?raw'

// EventBridge: events go to a bus; each rule matches an event pattern (source, detail-type, fields
// of detail) and sends matches to its targets; an SQS target's queue policy must allow
// events.amazonaws.com from the rule's ARN; the schema registry can discover event shapes.
// source: https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-event-patterns.html
// source: https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-use-resource-based.html
// source: https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-schema.html
export const events: Scene = mapFrame('event-routing', [...BUILT_BY[9], 'api', 'fn', 'queue', 'topic', 'bus'], {
  id: 'events-pane',
  label: 'side',
  bare: true,
  children: [
    { id: 'events-sh', kind: 'code', filename: 'infra/10-events.sh', label: code.replace(/\n+$/, ''), show: [[5, 17]], highlight: [5, 10, 11, 13, 14, 16, 17] },
    { id: 'events-run', kind: 'terminal', filename: 'Terminal — shop-on-aws · emulated', label: session.replace(/\n+$/, '') },
    {
      id: 'rules',
      kind: 'table',
      label: 'Rules, from infra/events/',
      headers: ['rule', 'matches', 'o-501 GB', 'o-506 FR', 'o-488 refund'],
      values: [
        ['uk-vat', 'OrderPlaced, country GB', 'yes', 'no', 'no'],
        ['refunds', 'OrderRefunded', 'no', 'no', 'yes'],
      ],
    },
    {
      id: 'topic-or-bus',
      kind: 'list',
      icon: 'eventbridge',
      label: 'Topic or bus',
      pattern: 'network',
      items: [
        'A topic: every subscriber gets each message; filters trim it',
        'A bus: rules route by what happened, from any field of the event',
        'A publisher never lists who listens, on either',
      ],
    },
  ],
})
