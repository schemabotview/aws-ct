import type { Section } from '../types'

export const athenaQueriesAndCost: Section = {
  id: 'athena-queries-and-cost',
  title: 'Athena query execution, SQL results, scanned data, and cost implications',
  scene: 'athena-query',
  focus: 'query-out',
  slide: `## Athena: SQL over S3

**Objective:** read a query's result, and predict its cost.

### Mental model
- **Athena**: serverless SQL over files the catalog describes
- Billed by **bytes scanned**; results written to S3
- Partition filters and columns cut the bytes

### Worked example: daily sales, 11–13 Sep
- Rows: 2,000 orders a day; sales **202,224.52**, 205,617.39, 202,876.5
- Run here in **DuckDB**, the same SQL Athena would run
- WHERE dt … reads 3 of 30 partitions
- Published **$5 per TB** scanned, **10 MB** minimum

### Misconception
- "A LIMIT makes it cheap" — the scan, not the rows returned, is billed

### Explanation summary
- Filter on partitions; select only the columns you need`,
  narration:
    "With the files laid out and catalogued, Athena can query them. Athena is serverless S Q L over S three: there is no cluster to run; you send a query, it reads the files the catalog points to, and it writes the result to S three. Athena is not available in this course's environment, so the program runs the same standard S Q L in DuckDB, a local engine, over the same date partitioned Parquet files, and the card says so. Read the query as an analyst would. It counts orders and sums sales per day, for the eleventh to the thirteenth of September, grouped and ordered by date. The result has one row per day: two thousand orders each, with sales of two hundred and two thousand two hundred and twenty four pounds fifty two, two hundred and five thousand six hundred and seventeen thirty nine, and two hundred and two thousand eight hundred and seventy six fifty. Because the where clause filters on the partition column, only three of thirty date folders are read. The command below submits the same query to Athena, in the analysts workgroup, which can cap and report usage. Athena bills by bytes scanned, published at five dollars per terabyte with a ten megabyte minimum per query; treat the rate as an example and check current pricing. The misconception is that adding a limit makes a query cheap. A limit cuts the rows returned, not the bytes scanned to find them. So filter on partitions, and select only the columns you need.",
}
