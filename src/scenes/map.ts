import type { Scene, SceneEdge, SceneNode } from '@graphlearning/flow'
import { SCENE_ASPECT } from '@graphlearning/shell'

// The shop's map: ONE architecture diagram that every map frame in the course is drawn from, the way
// the Spark course's file tree grows with its project. Every component is always present, with the
// same label and place, so the layout never moves between frames. A component the shop has not built
// yet keeps its label but trades its service logo for a neutral outline glyph in the `group` colour —
// an AWS logo is drawn in its own colours whatever the pattern, so the logo itself has to go. A tile's
// icon box is a fixed size, so the swap moves nothing. What a section is about is its focus.
//
// Component ids are stable for the whole course — scenes and sections refer to them by name.

export type Part =
  | 'shopper' | 'dns' | 'cdn' | 'waf'
  | 'lb' | 'app' | 'db' | 'cache'
  | 'api' | 'fn' | 'workflow' | 'queue' | 'topic' | 'bus'
  | 'buckets' | 'table' | 'lake' | 'athena' | 'stream'
  | 'accounts' | 'iam' | 'stacks' | 'pipeline' | 'watch' | 'trail' | 'keys' | 'backup' | 'cost'

export const ALL_PARTS: Part[] = [
  'shopper', 'dns', 'cdn', 'waf', 'lb', 'app', 'db', 'cache', 'api', 'fn', 'workflow', 'queue', 'topic', 'bus',
  'buckets', 'table', 'lake', 'athena', 'stream', 'accounts', 'iam', 'stacks', 'pipeline', 'watch', 'trail', 'keys', 'backup', 'cost',
]

interface Spec { label: string; icon: string; pattern: NonNullable<SceneNode['pattern']> }

const PARTS: Record<Part, Spec> = {
  shopper: { label: 'Shopper', icon: 'globe', pattern: 'user' },
  dns: { label: 'Route 53', icon: 'route53', pattern: 'network' },
  cdn: { label: 'CloudFront', icon: 'cloudfront', pattern: 'network' },
  waf: { label: 'WAF', icon: 'waf', pattern: 'warn' },
  lb: { label: 'Load balancer', icon: 'elb', pattern: 'network' },
  app: { label: 'App servers', icon: 'ec2', pattern: 'service' },
  db: { label: 'Orders DB', icon: 'rds', pattern: 'storage' },
  cache: { label: 'Cache', icon: 'elasticache', pattern: 'storage' },
  api: { label: 'Order API', icon: 'apigateway', pattern: 'service' },
  fn: { label: 'place-order', icon: 'lambda', pattern: 'service' },
  workflow: { label: 'Workflow', icon: 'stepfunctions', pattern: 'service' },
  queue: { label: 'Queue', icon: 'sqs', pattern: 'network' },
  topic: { label: 'Topic', icon: 'sns', pattern: 'network' },
  bus: { label: 'Event bus', icon: 'eventbridge', pattern: 'network' },
  buckets: { label: 'Buckets', icon: 's3', pattern: 'storage' },
  table: { label: 'Orders table', icon: 'dynamodb', pattern: 'storage' },
  lake: { label: 'Lake + catalog', icon: 'glue', pattern: 'storage' },
  athena: { label: 'Athena', icon: 'athena', pattern: 'service' },
  stream: { label: 'Clickstream', icon: 'kinesis', pattern: 'network' },
  accounts: { label: 'Accounts', icon: 'organizations', pattern: 'user' },
  iam: { label: 'IAM roles', icon: 'iam', pattern: 'user' },
  stacks: { label: 'Stacks', icon: 'cloudformation', pattern: 'service' },
  pipeline: { label: 'Pipeline', icon: 'codepipeline', pattern: 'service' },
  watch: { label: 'CloudWatch', icon: 'cloudwatch', pattern: 'network' },
  trail: { label: 'CloudTrail', icon: 'cloudtrail', pattern: 'network' },
  keys: { label: 'KMS keys', icon: 'kms', pattern: 'warn' },
  backup: { label: 'Backups', icon: 'backup', pattern: 'storage' },
  cost: { label: 'Cost', icon: 'costexplorer', pattern: 'external' },
}

export interface MapState {
  /** the parts the shop has at this point of the course; everything else is drawn neutral */
  built: Part[]
}

/** Every part, in course order: what the shop has by the END of each course. */
export const BUILT_BY: Record<number, Part[]> = (() => {
  const adds: Record<number, Part[]> = {
    3: ['shopper', 'buckets', 'cost'],
    4: ['accounts', 'iam'],
    5: ['dns', 'lb'],
    6: ['app'],
    7: ['stacks', 'pipeline'],
    8: ['keys'],
    9: ['db', 'table', 'cache'],
    10: ['api', 'fn', 'workflow', 'queue', 'topic', 'bus'],
    11: ['lake', 'athena', 'stream'],
    12: ['watch', 'trail', 'waf', 'backup'],
    13: ['cdn'],
  }
  const out: Record<number, Part[]> = {}
  let acc: Part[] = []
  for (let c = 1; c <= 13; c++) {
    acc = [...acc, ...(adds[c] ?? [])]
    out[c] = acc
  }
  return out
})()

export function shopMap(prefix: string, state: MapState): SceneNode {
  const built = new Set(state.built)
  const part = (p: Part): SceneNode => {
    const s = PARTS[p]
    return built.has(p)
      ? { id: `${prefix}${p}`, label: s.label, icon: s.icon, pattern: s.pattern, variant: 'tile' }
      : { id: `${prefix}${p}`, label: s.label, icon: 'box', pattern: 'group', variant: 'tile' }
  }
  const group = (id: string, label: string, parts: Part[], extra: Partial<SceneNode> = {}): SceneNode => ({
    id: `${prefix}${id}`, label, pattern: 'group', icon: 'none', children: parts.map(part), ...extra,
  })
  const e = (a: string, b: string, label?: string): SceneEdge => ({ source: `${prefix}${a}`, target: `${prefix}${b}`, ...(label ? { label } : {}) })

  return {
    id: `${prefix}map`,
    label: 'The shop',
    bare: true,
    gap: 'tight',
    children: [
      {
        id: `${prefix}path`,
        label: 'Request path',
        bare: true,
        children: [
          {
            id: `${prefix}front`,
            label: 'Front',
            bare: true,
            flow: 'LR',
            children: [part('shopper'), group('edge', 'Edge', ['dns', 'cdn', 'waf'], { cols: 3 })],
            edges: [e('shopper', 'edge')],
          },
          {
            id: `${prefix}region`,
            label: 'eu-west-2 · production account',
            pattern: 'group',
            icon: 'awscloud',
            cols: 2,
            align: 'start',
            children: [
              group('vpc', 'VPC shop-prod', ['lb', 'app', 'db', 'cache'], { cols: 2 }),
              group('data', 'Data', ['buckets', 'table', 'lake', 'athena', 'stream'], { cols: 3 }),
              group('checkout', 'Checkout', ['api', 'fn', 'workflow', 'queue', 'topic', 'bus'], { cols: 6, span: 'all' }),
            ],
          },
        ],
        edges: [e('front', 'region')],
      },
      group('controls', 'Around everything', ['accounts', 'iam', 'stacks', 'pipeline', 'watch', 'trail', 'keys', 'backup', 'cost'], { cols: 5 }),
    ],
  }
}

// A map frame: the map on the left at its natural size, the lesson on the right in a side pane that
// is pinned to fill the rest of a 16:9 frame. The map's size never changes (every part is always
// drawn, with the same label), so as long as the side's content fits inside its floor the map sits
// at the same pixels in every map frame of the course — check-render.mjs holds it there.
// MAP_W × MAP_H is the map as computeLayout places it; measured, and re-measured if a label changes.
export const MAP_W = 924
export const MAP_H = 1078
const GAP = 10
export const MAP_SIDE_W = Math.round(MAP_H * SCENE_ASPECT) - MAP_W - GAP

export function mapFrame(id: string, built: Part[], side: SceneNode): Scene {
  const fill = (n: SceneNode): SceneNode => (n.bare && n.children ? { ...n, minW: MAP_SIDE_W, children: n.children.map((c) => ({ ...c, minW: MAP_SIDE_W })) } : { ...n, minW: MAP_SIDE_W })
  return {
    id,
    padding: 0.04,
    flow: 'LR',
    align: 'start',
    gap: 'tight',
    nodes: [
      { ...shopMap('', { built }), id: `${id}-map` },
      { id: `${id}-side`, label: 'side', bare: true, framed: true, minW: MAP_SIDE_W, minH: MAP_H, children: [fill(side)] },
    ],
    edges: [],
  }
}
