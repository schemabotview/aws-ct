import type { Course } from '../types'
import { operationalVsAnalytical } from './01-operational-vs-analytical'
import { ingestionAndReconciliation } from './02-ingestion-and-reconciliation'
import { lakeLayout } from './03-lake-layout'
import { glueCatalogAndGovernance } from './04-glue-catalog-and-governance'
import { athenaQueriesAndCost } from './05-athena-queries-and-cost'
import { kinesisStreaming } from './06-kinesis-streaming'
import { redshiftAndEmr } from './07-redshift-and-emr'

// Chapter 8 of AWS-COURSE-PLAN.md — 7 of 7 sections, one scene each.
//
// Objective: Explain a bounded analytical pipeline and select processing services from consumer
// requirements.
//
// Worked illustrations (from the plan): order changes → S3 → catalog → Athena diagram (§1); an annotated
// aggregation query and expected rows (§5, run in DuckDB over the same Parquet, labelled); a
// partition-pruning comparison (§3, measured); late and duplicate records (§2, run); a streaming consumer
// falling behind (§6, Kinesis Data Streams named). Current operational state vs historical records (§1);
// catalog metadata vs permission enforcement vs data quality (§4).
//
// Outcome: Explain how operational records become queryable analytical data, select a provisional
// processing approach, and recognise freshness, reconciliation, layout, and governance trade-offs.
//
// Bridge: The application and data paths are understandable; next we make their infrastructure and
// releases reproducible. (Spoken as the last line of §7's narration.)
export const analytics: Course = {
  id: 'analytics',
  title: 'Data Movement and Analytical Workloads',
  sections: [
    operationalVsAnalytical,
    ingestionAndReconciliation,
    lakeLayout,
    glueCatalogAndGovernance,
    athenaQueriesAndCost,
    kinesisStreaming,
    redshiftAndEmr,
  ],
}
