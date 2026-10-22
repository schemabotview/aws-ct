import type { Scene, SceneNode } from '@graphlearning/flow'

// Choosing a database starts from the access patterns, not the engine: what is read and written,
// by which key, how often, what must change together, and how fresh a read must be. The rates are
// the shop's evening peak, assumed (CLAUDE.md, "access mix").
// source: https://docs.aws.amazon.com/decision-guides/latest/databases-on-aws-how-to-choose/databases-on-aws-how-to-choose.html
const need = (id: string, label: string, sub: string, icon: string, items: string[], pattern: SceneNode['pattern']): SceneNode =>
  ({ id, kind: 'list', label, sub, icon, pattern, items })

export const needs: Scene = {
  id: 'access-patterns',
  padding: 0.04,
  header: 'band',
  nodes: [
    {
      id: 'patterns-row',
      label: 'Access patterns',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        {
          id: 'patterns',
          kind: 'table',
          label: 'What the shop asks of its data, at the evening peak',
          headers: ['pattern', 'rate', 'by', 'must be'],
          values: [
            ['show a product', '~450 reads/s', 'product id', 'fast; a minute old is fine'],
            ['place an order', '~6 writes/s', 'new order', 'all or nothing, never oversell'],
            ['a customer’s orders', '~40 reads/s', 'customer, newest first', 'their own, up to date'],
            ['sales by day', 'a few a day', 'date range, everything', 'cheap to scan; Course 11'],
          ],
        },
      ],
    },
    {
      id: 'model-row',
      label: 'Models',
      bare: true,
      flow: 'LR',
      align: 'start',
      stretch: true,
      children: [
        need('m-relational', 'Relational · RDS', 'tables, joins, transactions', 'rds', ['Rows in tables, linked by keys', 'Many rows change in one transaction', 'Any question, asked in SQL', 'The shop: orders, lines, stock'], 'storage'),
        need('m-keyvalue', 'Key-value · DynamoDB', 'items by key, at any scale', 'dynamodb', ['Each read names its key', 'Steady latency as data grows', 'Only the questions the keys allow', 'The shop: a customer’s orders'], 'service'),
        need('m-cache', 'In-memory · ElastiCache', 'a copy, close to the app', 'elasticache', ['Microseconds, from memory', 'Expires, or is deleted on write', 'Never the only copy', 'The shop: product pages'], 'network'),
      ],
    },
    {
      id: 'questions',
      kind: 'list',
      icon: 'database',
      label: 'Five questions before choosing an engine',
      pattern: 'group',
      items: [
        'Which keys does every read and write name?',
        'What must change together, or not at all?',
        'How stale may a read be: never, or a minute?',
        'How fast does the data grow, and for how long is it kept?',
        'Who runs it: patching, backups, failover?',
      ],
    },
  ],
  edges: [],
}
