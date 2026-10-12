import type { Section } from '../types'

export const lakeLayout: Section = {
  id: 'lake-layout',
  title: 'S3 lake layout, columnar formats, partitioning, and small-file implications',
  scene: 'lake-layout',
  focus: 'layout-out',
  slide: `## Lake layout, partitions, small files

**Objective:** lay files out so queries read little.

### Mental model
- **Columnar** formats (Parquet): read only the columns asked for
- **Partitions** (dt=2026-09-12/): skip whole folders
- **Small files**: per-file overhead and many opens

### Worked example: one September day, measured
- Unpartitioned: **629 KiB** opened
- dt= partitions: **24 KiB** — 26× less
- Same day as 200 tiny files: **220 KiB**, 200 opens

### Misconception
- "Storage is cheap, layout doesn't matter" — queries pay per byte read

### Explanation summary
- Parquet, partitioned by how you filter, in sensibly sized files`,
  narration:
    "Once data is in S three, its layout decides how much every query has to read. Three ideas matter. Columnar formats such as Parquet store each column together, so a query that needs only the date and the total reads only those columns. Partitioning puts files into folders by a value you often filter on, like dt equals the twenty sixth of September, so a query for one day can skip every other folder. And file size matters, because every file carries its own metadata and costs a request to open. The program measures all three on a seeded month of order history, sixty thousand rows, written as Parquet three ways. A query for the twelfth of September opens six hundred and twenty nine kibibytes when the data is unpartitioned, because it must look at everything. With date partitions, it opens twenty four kibibytes, about twenty six times less. Then the same single day written as two hundred tiny files, which is what a stream writing every few seconds tends to produce: two hundred and twenty kibibytes and two hundred file opens, for the same two thousand rows. The fix for small files is compaction, a job that rewrites them into fewer, larger ones. The misconception is that storage is cheap, so layout does not matter. Storing it is cheap; reading it is what you pay for, on every query. So use Parquet, partition by how you filter, and keep files sensibly sized.",
}
