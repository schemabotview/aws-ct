import type { Scene } from '@graphlearning/flow'

// §8.7 — choosing the processing engine from the consumers' requirements. Athena: serverless SQL over
// S3; Redshift: a warehouse with managed storage for many concurrent dashboards; EMR: managed
// Spark/Hadoop clusters for custom large-scale processing. The Spark course covers EMR's engine.
// source: https://docs.aws.amazon.com/decision-guides/latest/decision-guides/analytics-on-aws-how-to-choose.html
export const warehouseOrCluster: Scene = {
  id: 'warehouse-or-cluster',
  title: 'Who consumes it decides the engine',
  flow: 'TB',
  padding: 0.06,
  nodes: [
    {
      id: 'engines',
      label: 'Three engines over the same lake',
      pattern: 'group',
      cols: 3,
      children: [
        { id: 'e-athena', label: 'Athena', sub: 'ad hoc SQL, per scan', pattern: 'service', icon: 'athena' },
        { id: 'e-redshift', label: 'Redshift', sub: 'warehouse, dashboards', pattern: 'service', icon: 'redshift' },
        { id: 'e-emr', label: 'EMR', sub: 'Spark clusters, code', pattern: 'service', icon: 'emr' },
      ],
    },
    {
      id: 'select',
      kind: 'table',
      label: 'Selecting from requirements',
      sub: 'provisional choices for the shop',
      headers: ['consumer needs', 'start with'],
      values: [
        ['a few analysts, ad hoc questions', 'Athena'],
        ['50 dashboards, refreshed hourly', 'Redshift'],
        ['custom ML features from years of data', 'EMR (Spark)'],
        ['a monthly CSV for finance', 'Athena + export'],
      ],
    },
    {
      id: 'warn',
      kind: 'list',
      framed: true,
      label: 'Before adding an engine',
      icon: 'warehouse',
      pattern: 'warn',
      items: [
        'one copy of truth: the lake, catalogued',
        'every engine is another bill and role',
        'freshness needed decides batch vs stream',
      ],
    },
  ],
  edges: [],
}
