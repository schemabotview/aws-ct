import type { Scene, SceneNode } from '@graphlearning/flow'

// Operational (OLTP) databases serve many small reads and writes of current state; analytical
// queries scan history across many rows. The AWS analytics path in this course: export or CDC
// into S3, a Glue Data Catalog table, Athena (serverless SQL on S3), Lake Formation permissions.
// source: https://docs.aws.amazon.com/whitepapers/latest/building-data-lakes/building-data-lake-aws.html
// source: https://docs.aws.amazon.com/athena/latest/ug/what-is.html
const stage = (id: string, label: string, sub: string, icon: string, pattern: SceneNode['pattern']): SceneNode =>
  ({ id, label, sub, icon, pattern, variant: 'tile' })

export const history: Scene = {
  id: 'state-vs-history',
  padding: 0.04,
  header: 'band',
  nodes: [
    {
      id: 'path',
      label: 'From the orders database to an answer',
      bare: true,
      flow: 'LR',
      children: [
        stage('h-db', 'Orders DB', 'current state', 'rds', 'storage'),
        stage('h-move', 'Export / CDC', '§2', 'dms', 'network'),
        stage('h-lake', 'S3 lake', 'Parquet by day, §3', 's3', 'storage'),
        stage('h-catalog', 'Glue catalog', 'tables, who reads, §4', 'glue', 'service'),
        stage('h-athena', 'Athena', 'SQL, priced by scan, §5', 'athena', 'service'),
      ],
      edges: [
        { source: 'h-db', target: 'h-move' },
        { source: 'h-move', target: 'h-lake' },
        { source: 'h-lake', target: 'h-catalog' },
        { source: 'h-catalog', target: 'h-athena' },
      ],
    },
    {
      id: 'contrast',
      label: 'Two jobs',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        {
          id: 'state-history',
          kind: 'table',
          label: 'State against history',
          headers: ['', 'the orders database', 'the lake'],
          values: [
            ['holds', 'what is true now', 'everything that happened'],
            ['a typical question', 'order o-501’s lines', 'sales by day, by country'],
            ['reads', 'a few rows, by key', 'millions of rows, a few columns'],
            ['writes', 'thousands a minute', 'appended in batches'],
            ['if it is slow', 'checkout suffers', 'a report is late'],
          ],
        },
        {
          id: 'why-not',
          kind: 'list',
          icon: 'rds',
          label: 'Why not report from the orders database',
          pattern: 'warn',
          items: [
            'A month’s scan competes with checkout for the same CPU and connections',
            'It keeps only current state: an order updated three times shows once',
            'History grows forever; the transactional tables should not',
            'A read replica helps the first, not the other two',
          ],
        },
      ],
    },
  ],
  edges: [],
}
