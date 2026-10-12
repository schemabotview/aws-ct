import type { Section } from '../types'

export const glueCatalogAndGovernance: Section = {
  id: 'glue-catalog-and-governance',
  title: 'Glue Data Catalog, transformation jobs, schema changes, and access governance',
  scene: 'glue-catalog',
  focus: 'three-things',
  slide: `## Glue catalog and governance

**Objective:** separate what a table claims from what is enforced.

### Mental model
- **Glue Data Catalog**: table metadata — location, columns, partitions
- **Glue jobs**: transform and compact the files
- **Lake Formation / IAM**: who may read which columns

### Worked example: shop_lake.order_history
- Parquet at s3://shop-lake-…/order_history/, partitioned by **dt**
- Columns order_id and total **decimal(8,2)**
- A renamed column breaks readers until the schema is updated

### Misconception
- "It's in the catalog, so it's governed and correct" — three separate jobs

### Explanation summary
- Catalog describes; permissions enforce; checks verify`,
  narration:
    "Files in S three are just objects. To query them as tables, something must describe them, and that is the Glue Data Catalog. The request on the board, validated against the Glue A P I, creates the order history table in the shop lake database. It records the location in S three, the columns, order I D and total as a decimal with two places, the partition key d t, and that the files are Parquet. That is all it is: metadata, a claim about what the files contain. Glue jobs, typically Spark, do the transformation work: converting raw C D C files into partitioned Parquet, and compacting small files. Schema changes are where the claim and reality drift apart. If the upstream team renames total to amount, the files change but the catalog does not, and queries start returning nulls rather than errors. A crawler or the job itself must update the schema, deliberately. Now the table of three promises, which the plan asks us to keep apart. Where the data is and what shape it has is the catalog's job. Who may read which tables and columns is enforced by I A M and Lake Formation, which can grant at column and even row level. Whether the rows are right, complete and not duplicated is a data quality job, like the reconciliation in section two. The misconception is that a table in the catalog is therefore governed and correct. It is only described. The catalog describes, permissions enforce, and checks verify.",
}
