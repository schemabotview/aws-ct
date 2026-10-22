import type { Scene, SceneNode } from '@graphlearning/flow'

// Athena: serverless SQL on S3, per TB scanned. Redshift: a data warehouse (provisioned or
// Serverless) with its own managed storage, for frequent, complex BI queries. EMR: managed Spark,
// Hive and other frameworks on clusters (EC2, EKS or Serverless) for large transformations.
// source: https://docs.aws.amazon.com/decision-guides/latest/analytics-on-aws-how-to-choose/analytics-on-aws-how-to-choose.html
// source: https://docs.aws.amazon.com/redshift/latest/mgmt/welcome.html
// source: https://docs.aws.amazon.com/emr/latest/ManagementGuide/emr-what-is-emr.html
const engine = (id: string, label: string, sub: string, icon: string, items: string[], pattern: SceneNode['pattern']): SceneNode =>
  ({ id, kind: 'list', label, sub, icon, pattern, items })

export const warehouse: Scene = {
  id: 'warehouse-or-cluster',
  padding: 0.04,
  header: 'band',
  nodes: [
    {
      id: 'engines',
      label: 'Three engines over the same lake',
      bare: true,
      flow: 'LR',
      align: 'start',
      stretch: true,
      children: [
        engine('e-athena', 'Athena', 'SQL on S3, nothing to run', 'athena', ['Pay per TB scanned', 'Nothing to start or stop', 'Seconds to minutes a query', 'The shop today: daily sales'], 'service'),
        engine('e-redshift', 'Redshift', 'a warehouse', 'redshift', ['Its own fast storage, plus S3', 'Many dashboards, all day long', 'Provisioned, or Serverless', 'When BI queries run constantly'], 'storage'),
        engine('e-emr', 'EMR', 'clusters for Spark and more', 'emr', ['Spark, Hive, Presto, on clusters', 'Big transformations, not dashboards', 'On EC2, on EKS, or Serverless', 'When the job is the code'], 'network'),
      ],
    },
    {
      id: 'choose-row',
      label: 'Choosing',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        {
          id: 'choose',
          kind: 'table',
          label: 'Which engine, for which pattern',
          headers: ['the pattern', 'choose'],
          values: [
            ['a few queries a day, data in S3', 'Athena'],
            ['hundreds of dashboard queries an hour', 'Redshift'],
            ['transforming terabytes in code', 'EMR (Spark)'],
            ['a lakehouse platform, notebooks, jobs', 'Databricks on AWS'],
          ],
        },
        {
          id: 'caution',
          kind: 'list',
          icon: 'scale',
          label: 'Before adding a second engine',
          pattern: 'warn',
          items: [
            'Each one is another bill that runs while idle, unless serverless',
            'Each one needs the catalog’s permissions, or bypasses them',
            'Spark and Databricks each have their own course',
          ],
        },
      ],
    },
  ],
  edges: [],
}
