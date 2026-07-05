# aws-ct

Video-first content for the **AWS Certified Solutions Architect – Associate (SAA-C03)** concept, consumed at runtime by the [`graphl-movie`](../graphl-movie) app. Content only — notebooks, narration (`.tts` → `.wav`), authored one-screen slides (`.slide`: a `# Title`, `## ` sub-labels, short prose, fenced code, and `- `/numbered lists with **bold** key terms), and the wiring `manifest.json`. Nothing to build or run here. For the authoring contract and folder layout, see [`CLAUDE.md`](./CLAUDE.md).

This file is the **course outline** — the human-facing map of modules and sections. It is the plan we author against; the machine source of truth for structure is `manifest.json` (once authored).

**Status:** structure drafted — **14 modules, 148 sections** (spine below). **Modules 01–12 authored** — every section has `.ipynb` + `.slide` + `.tts`, and `manifest.json` wires them (01 → `aws-global`, 02 → `aws-iam`, 03–12 → `aws-cloud`). All three scenes are ported into the graphl-movie app (monogram tiles + official AWS service icons). Pending: Colab `.wav`s. Modules 13–14 not authored yet. Intended remote: `github.com/schemabotview/aws-ct`.

## Target exam

**AWS Certified Solutions Architect – Associate (SAA-C03)** — 65 questions, 130 minutes. Four weighted domains: Design Secure Architectures (30%), Design Resilient Architectures (26%), Design High-Performing Architectures (24%), Design Cost-Optimized Architectures (20%). The module spine below is a beginner→SAA path that builds toward those domains.

## Module spine (starting point — from `../aws-content`)

The source curriculum is the **14-module SAA path** in `../aws-content` (the graphl-ux-era repo, source of truth for the notebook split). Whether the video set keeps all 14 or normalizes toward the ~10-module video shape (as `databricks-data-engineer-ct` did — 9 dense, narrated modules) is a **next-pass decision**. Listed here as-is so we can agree the spine before splitting sections.

| # | Module | Source notebook | Scene (from graphl-ux `aws-*`) |
|---|---|---|---|
| 01 | Cloud & AWS Foundations | `01-cloud-and-aws-foundations.ipynb` | `aws-global` |
| 02 | IAM, Organizations & Account Security | `02-iam-organizations-and-account-security.ipynb` | `aws-iam` |
| 03 | Compute Core — EC2, ELB, Auto Scaling | `03-compute-core-ec2-elb-autoscaling.ipynb` | TBD |
| 04 | Serverless & Containers | `04-serverless-and-containers.ipynb` | TBD |
| 05 | Storage — S3, EBS, EFS, FSx | `05-storage-s3-ebs-efs-fsx.ipynb` | TBD |
| 06 | VPC & Connectivity | `06-vpc-and-connectivity.ipynb` | TBD (`aws-vpc` to port) |
| 07 | DNS, CDN & Edge | `07-dns-cdn-and-edge.ipynb` | TBD |
| 08 | Relational Databases & Caching | `08-relational-databases-and-caching.ipynb` | TBD |
| 09 | NoSQL & Analytics | `09-nosql-and-analytics.ipynb` | TBD |
| 10 | Integration & Streaming | `10-integration-and-streaming.ipynb` | TBD |
| 11 | Security Services | `11-security-services.ipynb` | TBD |
| 12 | Observability & Governance | `12-observability-and-governance.ipynb` | TBD |
| 13 | HA, DR, Cost & Migration | `13-ha-dr-cost-and-migration.ipynb` | TBD |
| 14 | Well-Architected & SAA Exam Prep | `14-well-architected-and-saa-exam-prep.ipynb` | TBD |

**Scenes available to port** (from `../graphl-ux/src/scenes/`): `aws-global.ts`, `aws-iam.ts`, `aws-cloud.ts`. graphl-ux also referenced `aws-vpc` and `aws-data-engineering` scene ids in its manifest — those may need authoring/porting. Scenes are app-owned in graphl-movie; this table only records intended wiring.

## Sections

Each module is normalized to **~10 tight teaching sections** (a section = one narrated slide + scene focus, ≈ one page). The source `../aws-content` notebooks run 11–35 `## ` headings each; we consolidate the fine-grained reference beats (e.g. every EC2 knob) into teaching-sized sections and drop pure scaffolding. **§1 of each module is the hook — the full scene map** (the mental model the rest of the module zooms into). **148 sections total** (source → video per module: 01 13→10, 02 17→11, 03 35→12, 04 27→11, 05 25→11, 06 18→11, 07 16→10, 08 18→10, 09 17→11, 10 17→10, 11 15→10, 12 11→10, 13 11→10, 14 13→11).

### 01 — Cloud & AWS Foundations (10 sections)

1. Why cloud — traditional IT vs. cloud *(hook — full map)*
2. The three service models — IaaS, PaaS, SaaS
3. Deployment models — cloud, hybrid, on-prem
4. AWS global infrastructure — the hierarchy
5. Regions — and how to choose one
6. Availability Zones
7. Edge locations & beyond-Region options (Local Zones, Wavelength, Outposts)
8. How you talk to AWS — console, CLI, SDK, IaC
9. The shared responsibility model
10. The Well-Architected Framework — six pillars *(primer; full treatment in module 14)*

### 02 — IAM, Organizations & Account Security (11 sections)

1. The root user & account day one *(hook — full map)*
2. What IAM is — the authorization engine
3. The three identity types — users, groups, roles
4. Role assumption — three policies, two sides
5. Policies — shape, types & the five policy slots
6. Policy evaluation — how AWS says yes or no (+ permission boundaries)
7. STS & cross-account access
8. Identity federation
9. AWS Organizations & SCPs
10. ABAC — tag-based access & condition keys
11. Account hygiene — Access Analyzer & MFA

### 03 — Compute Core: EC2, ELB, Auto Scaling (12 sections)

1. EC2 — the virtual server *(hook — full map)*
2. Launch configuration — what you choose at launch
3. Instance families, naming & T-series burstable
4. Purchasing options — on-demand, reserved, savings plans, spot
5. AMIs & bootstrapping — baked vs. user data
6. Networking an instance — security groups, IPs, ENIs, IMDS
7. Instance internals — Nitro, tenancy, placement groups, lifecycle
8. Elastic Load Balancing — the four types
9. ALB, NLB & GWLB — picking the load balancer
10. Target groups, health checks & draining
11. Auto Scaling Groups — launch templates & scaling policies
12. ASG operations — health checks, instance refresh, lifecycle hooks, warm pools

### 04 — Serverless & Containers (11 sections)

1. Serverless vs. containers vs. EC2 — the trade-off *(hook — full map)*
2. AWS Lambda — the execution model
3. Packaging, layers & configuration
4. Cold starts & concurrency
5. Invocation models & error handling
6. Lambda permissions, VPC & the serverless stack (API Gateway, Lambda@Edge)
7. Containers & ECR — the other compute model
8. Amazon ECS — object model & task definitions
9. ECS launch types, networking & scaling (EC2 vs. Fargate)
10. Amazon EKS — managed Kubernetes (and ECS vs. EKS)
11. Choosing a compute service (App Runner & the full picture)

### 05 — Storage: S3, EBS, EFS, FSx (11 sections)

1. Three storage shapes — object, block, file *(hook — full map)*
2. S3 — buckets & objects
3. S3 storage classes
4. S3 security & encryption
5. S3 data protection — versioning, object lock, replication
6. S3 lifecycle & cost management (Select, Batch Ops, Storage Lens)
7. S3 access & features — pre-signed URLs, access points, events, hosting
8. EBS — block storage for EC2 & volume types
9. EBS snapshots, encryption & instance store
10. EFS — shared file storage (performance & tiers)
11. FSx, Storage Gateway & the storage decision

### 06 — VPC & Connectivity (11 sections)

1. What a VPC is *(hook — full map)*
2. VPC & CIDR, subnets
3. Internet Gateway & route tables
4. NAT Gateway — outbound for private subnets
5. Security groups vs. network ACLs
6. Reaching private instances — Elastic IPs, VPC DNS, Flow Logs
7. VPC peering
8. VPC endpoints & PrivateLink
9. Transit Gateway
10. Reaching on-prem — Site-to-Site VPN & Direct Connect
11. Picking a connectivity option

### 07 — DNS, CDN & Edge (10 sections)

1. Three edge services, one job *(hook — full map)*
2. DNS & record types (Route 53 hosted zones)
3. Alias records & routing policies
4. Route 53 health checks & hybrid DNS
5. CloudFront — caching close to users (origins & OAC)
6. Cache behaviours, TTL & cache keys
7. CloudFront security & edge functions
8. Price classes & CloudFront vs. S3 cross-region replication
9. Global Accelerator
10. Picking the right edge service

### 08 — Relational Databases & Caching (10 sections)

1. The relational data tier on AWS *(hook — full map)*
2. RDS overview
3. RDS backups & point-in-time restore
4. Multi-AZ vs. read replicas
5. RDS security & RDS Proxy
6. Aurora — a different engine (and endpoints)
7. Aurora Serverless, Global Database & backtrack
8. RDS vs. Aurora — picking which
9. Caching — why, and the strategies
10. ElastiCache — Redis vs. Memcached (putting the tier together)

### 09 — NoSQL & Analytics (11 sections)

1. The database zoo — why purpose-built *(hook — full map)*
2. DynamoDB — core model
3. Partitions, hot keys & capacity modes
4. Read consistency & secondary indexes
5. DynamoDB operations & DAX
6. Streams, global tables, TTL & PITR
7. Redshift — the OLAP warehouse (architecture)
8. Loading & tuning Redshift — COPY, Spectrum, dist/sort keys
9. The analytics stack — Athena, Glue, EMR, OpenSearch
10. Purpose-built databases — the rest of the zoo
11. Picking the right database

### 10 — Integration & Streaming (10 sections)

1. Five services, one question *(hook — full map)*
2. SQS — the queue (standard vs. FIFO)
3. SQS operations — DLQs, polling, delays, large messages
4. SNS & the fan-out pattern
5. SQS vs. SNS vs. EventBridge — the messaging triangle
6. Kinesis Data Streams (consumers & fan-out)
7. Firehose, stream analytics & MSK
8. Step Functions — workflow orchestration
9. EventBridge — the event bus (schema registry, pipes, archive)
10. Picking the right tool

### 11 — Security Services (10 sections)

1. The six security layers *(hook — full map)*
2. KMS — envelope encryption & the key hierarchy
3. KMS key policies, grants & rotation
4. KMS in practice — S3, EBS, RDS
5. Secrets Manager vs. Parameter Store
6. Shield — DDoS protection
7. WAF & Firewall Manager
8. Cognito — user pools & identity pools
9. Detective services — GuardDuty, Macie, Inspector, Detective
10. Picking the right security tool

### 12 — Observability & Governance (10 sections)

1. Three observability services + a compliance layer *(hook — full map)*
2. The shared responsibility model
3. CloudWatch metrics
4. CloudWatch logs
5. CloudWatch alarms
6. CloudWatch agent & insights variants
7. CloudTrail — who did what
8. AWS Config — what changed, and is it compliant
9. Compliance — Artifact, Audit Manager, programmes
10. CloudWatch vs. CloudTrail vs. Config — picking the right tool

### 13 — HA, DR, Cost & Migration (10 sections)

1. RTO & RPO — the only two numbers that matter *(hook — full map)*
2. HA patterns within a Region
3. DR strategies — the four AWS shapes
4. AWS Backup
5. Right-sizing & idle elimination
6. Commitment discounts — Reserved Instances, Savings Plans, Spot
7. Cost tools — Cost Explorer, Budgets, Anomaly Detection
8. Migration — the 7 Rs
9. Migration services & the Snow family
10. Putting it together

### 14 — Well-Architected & SAA Exam Prep (11 sections)

1. The Well-Architected Framework — six pillars *(hook — full map)*
2. Pillar — Operational Excellence
3. Pillar — Security
4. Pillar — Reliability
5. Pillar — Performance Efficiency
6. Pillar — Cost Optimization
7. Pillar — Sustainability
8. The tools — Well-Architected Tool & Trusted Advisor
9. SAA blueprint — where each module fits
10. Reading a scenario question & distractor patterns
11. Study plan & closing

## Reference material

- Source curriculum: `../aws-content` (14 SAA notebooks + per-section `.tts`) and its upstream `~/Projects/aws`. Reference, not copied wholesale — we refine for video.
- Visual contract: `../graphl-movie/CLAUDE.md` (palette, fixed frame, own-color focus) and `../apache-spark-content/DESIGN.md`.
