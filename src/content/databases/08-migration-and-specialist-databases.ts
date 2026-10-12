import type { Section } from '../types'

export const migrationAndSpecialistDatabases: Section = {
  id: 'migration-and-specialist-databases',
  title: 'Migration with DMS and specialist database selection boundaries',
  scene: 'migration-and-specialists',
  focus: 'migration',
  slide: `## Migration with DMS, and specialists

**Objective:** move a live database, and know when to look elsewhere.

### Mental model
- **DMS** copies data: a **full load**, then **CDC** of ongoing changes
- Different engines need schema conversion first
- Cut over when the target has caught up, with a way back

### Worked example: orders-to-rds
- Old on-premises orders DB → RDS PostgreSQL
- **full-load-and-cdc**, every table in schema **shop**
- Validate row counts, then switch writes

### Misconception
- "A specialist database for every need" — each adds a system to run

### Explanation summary
- Migrate with CDC; specialise only for a real access pattern`,
  narration:
    "The shop did not start in A W S. Its original orders database runs on premises, and it must move to R D S without stopping sales for a weekend. The Database Migration Service, D M S, is built for that. A migration task first performs a full load, copying every existing row, and then keeps applying change data capture, every new insert, update and delete, until the target has caught up. Then you cut over, switching the application's writes to the new database, with a plan to switch back if something is wrong. The command on the board creates such a task, orders to R D S, with the migration type full load and C D C, and its parameters were checked against the D M S A P I. The table mappings select every table in the shop schema. When the source and target engines are the same, as PostgreSQL to PostgreSQL, the schema moves as it is; between different engines, the schema has to be converted first. Before cutover, validate: row counts, a sample of totals, and the latest order numbers on both sides. The lower table marks the boundaries of specialist databases: graph queries many hops deep point to Neptune, full text and log search to OpenSearch, years of analytics to Redshift, durable microsecond reads to MemoryDB, and the MongoDB A P I to DocumentDB. The misconception is that every need deserves its own database. Each one is another system to secure, back up and operate. Migrate with change data capture, and specialise only for a real access pattern. Durable application state now supports workflows that cross service boundaries; next we connect requests, events, and background work.",
}
