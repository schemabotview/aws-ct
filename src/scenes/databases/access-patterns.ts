import type { Scene } from '@graphlearning/flow'

// §6.1 — the shop's data requirements stated as access patterns before any engine is chosen: what is
// read and written, how often, what must change together, and how it grows. Rates follow the fixed
// 560 req/s peak; order counts are the course's assumptions.
// source: https://docs.aws.amazon.com/decision-guides/latest/decision-guides/databases-on-aws-how-to-choose.html
export const accessPatterns: Scene = {
  id: 'access-patterns',
  title: 'Start from the questions, not the engine',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'patterns',
      kind: 'table',
      label: 'The shop’s access patterns',
      sub: 'evening peak, assumed mix',
      headers: ['pattern', 'how often', 'needs'],
      values: [
        ['product page by id', '~450 reads/s', 'fast, cacheable'],
        ['place an order', '~6 writes/s', 'all-or-nothing'],
        ['a customer’s orders, newest first', '~40 reads/s', 'by customer, sorted'],
        ['stock for a product', 'every order', 'never below zero'],
        ['sales by day', 'nightly', 'scan history (Ch. 8)'],
      ],
    },
    {
      id: 'models',
      label: 'Three data models',
      pattern: 'group',
      cols: 3,
      children: [
        { id: 'm-relational', label: 'Relational', sub: 'tables, joins, SQL', pattern: 'storage', icon: 'rds' },
        { id: 'm-keyvalue', label: 'Key-value', sub: 'items by key', pattern: 'storage', icon: 'dynamodb' },
        { id: 'm-cache', label: 'In-memory', sub: 'copies, short-lived', pattern: 'storage', icon: 'elasticache' },
      ],
    },
    {
      id: 'questions',
      kind: 'list',
      framed: true,
      label: 'Ask before choosing',
      icon: 'search',
      pattern: 'network',
      items: [
        'which reads and writes, how often?',
        'what must change together?',
        'how stale may an answer be?',
        'how big in three years?',
      ],
    },
  ],
  edges: [],
}
