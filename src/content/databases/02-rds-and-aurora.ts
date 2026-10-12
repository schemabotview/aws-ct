import type { Section } from '../types'

export const rdsAndAurora: Section = {
  id: 'rds-and-aurora',
  title: 'RDS and Aurora: managed relational responsibilities and engine selection',
  scene: 'rds-instance',
  focus: 'create',
  slide: `## RDS and Aurora

**Objective:** know what a managed relational database takes off you.

### Mental model
- **RDS**: a managed engine — PostgreSQL, MySQL, MariaDB, Oracle, SQL Server
- **Aurora**: MySQL/PostgreSQL on AWS's own distributed storage
- AWS runs patching, backups, failover; schema and access stay yours

### Worked example: shop-orders
- PostgreSQL 16, **db.m7g.large**, gp3, **Multi-AZ**
- Encrypted, 7-day backups, deletion protection
- Password **managed in Secrets Manager**, never in code

### Misconception
- "Managed means tuned" — indexes and queries are still yours

### Explanation summary
- Managed engine, your data model`,
  narration:
    "The orders data is relational: orders, items, products and stock, joined and changed together in transactions. We could install PostgreSQL on an E C two instance ourselves, but R D S runs it for us. R D S is a managed relational service for several engines: PostgreSQL, MySQL, MariaDB, Oracle and SQL Server. Aurora is A W S's own design for MySQL and PostgreSQL compatible engines, built on a distributed storage layer that keeps six copies of the data across three zones. Read the request, validated against the R D S A P I. It creates shop orders on PostgreSQL sixteen, on a d b m seven g large instance with one hundred gibibytes of g p three storage. Multi A Z is on, so a standby waits in another zone. Storage is encrypted. Automated backups are kept for seven days, and deletion protection stops an accidental delete. Notice the password. Manage master user password asks R D S to create the password and keep it in Secrets Manager, so it never appears in code, configuration, or this request. The database sits in the data subnets behind the database security group from chapter three. The table shows who does what. R D S and Aurora take on installing and patching the engine in your maintenance window, backups and point in time recovery, and failover. Your schema, your S Q L, your indexes, and who may connect remain yours. The misconception is that managed means tuned. A missing index is just as slow on R D S. So R D S manages the engine, and you still own the data model.",
}
