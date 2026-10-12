import type { Scene } from '@graphlearning/flow'

// §8.4 — the Glue Data Catalog table for the order history (validated in full against CreateTable):
// it records WHERE the data is and WHAT shape it claims to have, partitioned by dt. It is metadata.
// Who may read which columns is enforced by IAM / Lake Formation; whether the rows are correct is a
// data-quality job. Three separate things.
// source: https://docs.aws.amazon.com/glue/latest/dg/catalog-and-crawler.html
// source: https://docs.aws.amazon.com/glue/latest/dg/security-lf-enable.html
export const glueCatalog: Scene = {
  id: 'glue-catalog',
  title: 'A catalog entry is a claim, not a guarantee',
  flow: 'TB',
  padding: 0.05,
  nodes: [
    {
      id: 'table',
      kind: 'code',
      filename: 'glue.CreateTable.request.json · model-checked',
      hug: true,
      label: `{
  "DatabaseName": "shop_lake",
  "TableInput": {
    "Name": "order_history",
    "TableType": "EXTERNAL_TABLE",
    "PartitionKeys": [{ "Name": "dt", "Type": "string" }],
    "StorageDescriptor": {
      "Location":
        "s3://shop-lake-111122223333/order_history/",
      "Columns": [
        { "Name": "order_id", "Type": "string" },
        { "Name": "total", "Type": "decimal(8,2)" }
      ],
      "InputFormat": "org.apache.hadoop.hive.ql.io.parquet.MapredParquetInputFormat",
      "OutputFormat": "org.apache.hadoop.hive.ql.io.parquet.MapredParquetOutputFormat",
      "SerdeInfo": {
        "SerializationLibrary": "org.apache.hadoop.hive.ql.io.parquet.serde.ParquetHiveSerDe"
      }
    },
    "Parameters": { "classification": "parquet" }
  }
}`,
    },
    {
      id: 'three-things',
      kind: 'table',
      label: 'Three different promises',
      sub: 'none implies the others',
      headers: ['question', 'answered by'],
      values: [
        ['where is it, what shape?', 'Glue Data Catalog'],
        ['who may read which columns?', 'IAM + Lake Formation'],
        ['are the rows right?', 'data-quality checks'],
        ['did the schema change?', 'a crawler or the job'],
      ],
    },
  ],
  edges: [],
}
