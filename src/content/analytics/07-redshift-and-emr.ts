import type { Section } from '../types'

export const redshiftAndEmr: Section = {
  id: 'redshift-and-emr',
  title: 'Redshift and EMR: warehouse and distributed-processing selection',
  scene: 'warehouse-or-cluster',
  focus: 'select',
  slide: `## Redshift and EMR

**Objective:** pick an engine from what consumers need.

### Mental model
- **Athena**: ad hoc SQL, pay per scan, nothing to run
- **Redshift**: a warehouse for many concurrent dashboards
- **EMR**: Spark clusters for custom large-scale processing

### Worked example: the shop's consumers
- A few analysts → **Athena**
- 50 hourly dashboards → **Redshift**
- ML features from years of data → **EMR (Spark)**
- Every engine is another bill and set of roles

### Misconception
- "A bigger engine is a better one" — each adds cost and roles

### Explanation summary
- One lake of truth; engines chosen per consumer`,
  narration:
    "The last choice is the processing engine, and it should come from who consumes the data, not from which engine is most impressive. Three engines can sit over the same lake. Athena runs ad hoc S Q L, billed per scan, with nothing to keep running. Redshift is a data warehouse: it keeps data in managed storage optimised for repeated analytical queries, and it serves many concurrent dashboards with consistent performance. E M R runs managed Spark and Hadoop clusters for processing that needs custom code at large scale; the Spark course covers that engine in depth. Read the selection table for the shop. A few analysts asking new questions each week: start with Athena. Fifty dashboards refreshed every hour for the whole company: a warehouse such as Redshift, because the same queries repeat all day. Building machine learning features from years of clickstream: E M R with Spark. A monthly C S V for finance: an Athena query and an export. These are provisional choices, revisited when the consumers change. The list underneath says what to check before adding any engine. Keep one copy of truth, the catalogued lake, rather than several diverging copies. Remember that every engine is another bill, another set of roles to secure, and another thing to monitor. And let the freshness each consumer actually needs decide between batch and streaming. The misconception is that a bigger engine is a better one. Each one adds cost and operational work. Keep one lake of truth, and choose engines per consumer. The application and data paths are understandable; next we make their infrastructure and releases reproducible.",
}
