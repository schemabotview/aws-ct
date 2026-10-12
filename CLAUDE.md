# CLAUDE.md — aws-ct

> The workspace-level `CLAUDE.md` (one level up, in `graphl-workspace`) holds the invariants that
> span every repo. This file is only what is true *here*.

## What this repo is

The GraphL concept app for **AWS**, authored from **`AWS-COURSE-PLAN.md`** (approved; 12 chapters,
89 sections). A **section** is `(scene, slide, narration)` and is one segment of the course video.
One section = one slide. The plan is not edited here: it is reviewed upstream in `toc`
(`toc/src/AWS-COURSE-PLAN.md`, identical at the time of scaffolding).

Engine `@graphlearning/flow@^1.2.0` (resolves 1.3.0, which ships AWS service icons); shell
`@graphlearning/shell@^0.10.1` (the SQL repo's version, not the template's 0.8). This repo's own
surface is `src/content/`, `src/scenes/`, `src/main.tsx`, `src/theme.css` and `scripts/`.

## Route contract

- Slug **`aws-ct`** — the GitHub repo name, the vite `base` (`/aws-ct/`) and the path under
  `graphl.in`. All three must be the same string.
- Routes: `#/` is the catalog; a section is `#/<courseId>-<sectionId>`, e.g.
  `#/foundations-billing-and-cleanup`. `?capture=1` and `window.__scene.plan()` come from the shell.
- Audio: `public/audio/<courseId>/<sectionId>.wav`. Section ids are unique within a course; scene ids
  are unique across the repo.

## Course arc and status

Chapters are authored one at a time, each reviewed by the owner on its rendered routes before the next
begins. A course is registered in `src/content/index.ts` / `src/scenes/index.ts` only once authored.
Each numbered plan item is exactly one section, in plan order, file `NN-<id>.ts` with `NN` = the item
number; its `title` is the plan's wording **verbatim** (`scripts/check-plan.mjs` enforces this).

| # | Course id | Chapter | Sections | Status |
| --- | --- | --- | --- | --- |
| 1 | `foundations` | Cloud Foundations and a Safe First Workload | 6 | authored, awaiting owner review (no narration audio yet) |
| 2 | `identity` | Identity, Permissions, and Account Governance | 7 | authored, awaiting owner review (no narration audio yet) |
| 3 | `networking` | Networking and the Request Path | 9 | authored, awaiting owner review (no narration audio yet) |
| 4 | `compute` | Compute and Elastic Application Capacity | 8 | authored, awaiting owner review (no narration audio yet) |
| 5 | `storage` | Storage and the Data Lifecycle | 7 | authored, awaiting owner review (no narration audio yet) |
| 6 | `databases` | Databases and Application Access Patterns | 8 | authored, awaiting owner review (no narration audio yet) |
| 7 | `integration` | APIs, Serverless Execution, and Asynchronous Work | 9 | authored, awaiting owner review (no narration audio yet) |
| 8 | `analytics` | Data Movement and Analytical Workloads | 7 | authored, awaiting owner review (no narration audio yet) |
| 9 | `delivery` | Repeatable Infrastructure and Delivery | 7 | authored, awaiting owner review (no narration audio yet) |
| 10 | `operations` | Production Visibility, Security, and Recovery | 10 | authored, awaiting owner review (no narration audio yet) |
| 11 | `optimisation` | Performance, Cost, and Sustainability | 6 | authored, awaiting owner review (no narration audio yet) |
| 12 | `architecture` | Architecture Evolution and Justified Decisions | 5 | authored, awaiting owner review (no narration audio yet) |

Each course's `index.ts` carries the plan's objective, worked illustrations, outcome and bridge as a
comment; the bridge is also the last words of the chapter's final narration.

## Verification levels — read before trusting a code card

There is no AWS account behind this course, so the SQL/Spark rule "every result was produced by a
real run" cannot hold. Instead **every code card declares how it was verified**, as the last part of
its `filename` after ` · `, and `npm run check:aws` (`scripts/check-aws.py`) proves the claim:

| level | what it means | what check:aws does |
| --- | --- | --- |
| `runs locally` | real Python or SQL, really run | runs the `.py` card (or a `.sql` card in a fresh database on the local PostgreSQL 16 cluster, errors included); a sibling node `<id>-out` must equal its output exactly |
| `model-checked` | checked against the AWS service models (botocore, the source the CLI/SDKs are generated from) and AWS's IAM reference (parliament) | `.sh`: parses with `bash -n`, and service, operation and every `--param` exist; `<service>.<Operation>.request.json`: the whole request validated by botocore's ParamValidator (nested members, required, types) plus a walk of the model's enum values, which ParamValidator does not check; `<service>.<Operation>.json`: every top-level key is in that response shape; policy `.json`: Effect/Action present, and parliament finds no unknown action, prefix, condition key, bad ARN or action/resource mismatch, and every global `aws:` condition key is in parliament's list (parliament skips per-action key checks when `Action` is `*`) (trust policies are recognised: all statements have a Principal and only `sts:` actions); `.asl.json`: Step Functions structure (StartAt, every Next/Default/Catch target, Task Resource, Next-or-End, Retry/Catch fields); `.yaml`: cfn-lint in-process for eu-west-2, any finding fails |
| `emulated` | behaviour from moto's emulator, **not AWS** | runs the `.py` card like `runs locally` |
| `doc-cited` | AWS documentation says so | the scene file must carry a `// source: https://…` comment |
| `illustrative` | made-up but realistic; nothing checks it | counted, so unverified cards stay visible |

**Hidden verifications — `verify/<course>/*.py`.** Claims a board makes that no card can show (which
request a policy allows, implicitly denies or explicitly denies) are asserted there, usually against
moto with IAM enforcement on; each file must exit 0 and runs in `check:aws`. A board backed by one
says so in its caption ("outcomes checked in moto's emulator"). Mutate a row and confirm the file
fails before trusting it. **moto trap:** `set_initial_no_auth_action_count(n)` must equal the setup
calls exactly — too high and the first checked requests skip authorisation and "pass"; each file
therefore probes that an unallowed call is denied before checking the board. moto does not model
cross-account evaluation, SCPs or RCPs; those claims stay doc-cited.

Rules: a response card shows values that are **invented but shape-checked** (ETags, timestamps, role
suffixes) — never present them as captured output. CLI customisations (`aws sso login`,
`aws configure`, high-level `aws s3 …`) have no API operation and are reported as unchecked. When a
claim is not on a card (a quota, a default, a timing), put its source URL in the scene's comment.
Install the checker's deps with `pip install -r scripts/requirements-check.txt`; `.sql` cards need the local cluster (`pg_ctlcluster 16 main start`, and once `su postgres -c 'createuser -s root'`).

**Network note (2026-10-12):** this environment's policy denies `docs.aws.amazon.com` (and
`aws.amazon.com`, `docs.aws.eu`, `docs.amazonaws.cn`), so Chapter 1's documentation claims were
verified through web search of those pages, and the URLs cited are the AWS pages the search returned.
Allowing `docs.aws.amazon.com` in the environment's network settings would let later chapters read
the pages directly.

## The fixed example — the shop (frozen: slides quote these numbers)

| fact | value |
| --- | --- |
| app | an online ordering app, `shop.example.com`; product page `GET /products/p-1001` |
| Region | `eu-west-2` (London), three AZs `eu-west-2a/b/c` |
| accounts | production **111122223333**, development **444455556666** (AWS documentation placeholders) |
| people | **alex**, developer, permission set **ShopDeveloper**, profile `shop-dev`, portal `https://shop-example.awsapps.com/start` |
| storage | bucket `shop-catalog-<account>`; product JSON at `products/p-1001.json` (1,834 bytes) |
| traffic | 60 req/s 00–08 h, 240 req/s 08–18 h, 560 req/s 18–24 h; one app server = 150 req/s → 1 / 2 / 4 servers; elastic 52 vs fixed 96 server-hours a day; peak 4 servers → 2 per AZ (6) to survive an AZ |
| rate card | **hypothetical**, USD: instance $0.04/h, block volume $0.08/GB-month, public IPv4/Elastic IP $0.005/h, snapshot $0.05/GB-month, object storage $0.023/GB-month, 730 h/month; 1-year commitment $0.028/h (30% off), Spot $0.016/h. Always labelled hypothetical on screen |
| dev ledger | running $36.21/month, instance stopped $7.01 |
| organization | management **123456789012** at the root; OU Security → audit **777788889999**; OU Workloads → OU Prod (111122223333), OU Dev (444455556666); org id `o-a1b2c3d4e5` |
| groups | Developers (alex): dev → ShopDeveloper, prod → ShopReadOnly; Operators (sam): prod → ShopOperator |
| workload role | **OrderApi** in prod, trusted by `ec2.amazonaws.com`, via instance profile `OrderApi`; policy `OrderApiAccess`: ReadProducts (GetObject `products/*`), ListProducts (ListBucket, prefix `products/*`), SendOrderEvents (SendMessage `order-events`), plus §2.4's DenyDrafts (`products/drafts/*`) |
| cross-account | role **Auditor** in audit reads `shop-reports-111122223333` (bucket policy + identity policy) |
| queue | `arn:aws:sqs:eu-west-2:111122223333:order-events` |

| VPC (prod) | `shop-prod` 10.20.0.0/16; subnets public-a/b/c 10.20.0–2.0/24, app-a/b/c 10.20.10–12.0/24, data-a/b/c 10.20.20–22.0/24; app-b server ENI 10.20.11.37; dev VPC 10.30.0.0/16 via peering `pcx-dev` |
| routes | rt-public: local + 0.0.0.0/0 → igw-shop; rt-app-a: local, 10.30.0.0/16 → pcx-dev, 0.0.0.0/0 → nat-a (NAT gateway in public-a) |
| filters | sg-alb 443 from anywhere → sg-app 8080 from sg-alb → sg-db 5432 from sg-app (PostgreSQL) |
| DNS / TLS | Route 53 zone example.com, alias A shop.example.com → ALB `shop-alb-123.eu-west-2.elb.amazonaws.com`; ACM cert in eu-west-2, TLS 1.3 policy; ALB → app plain HTTP |
| target group | `shop-app` HTTP 8080, /health every 10 s, unhealthy 2, healthy 3 → app-3 unhealthy at 15 s, back at 85 s; 560 req/s = 93 per target over 6, 112 over 5 |
| payments | external API `api.payments.example.com` → 198.51.100.7 |
| app servers | launch template `order-api` v14: m7g.large (Graviton, 2 vCPU, 8 GiB), instance profile OrderApi, IMDSv2 required, sg-app; release `order-api-1.4.2.jar` in `shop-releases-111122223333`; logs `/shop/order-api` |
| scaling | ASG `order-api`, min 3 (one per AZ); scheduled action `evening-peak` 17:45 Europe/London → min 6; reactive-only model: 5 min short, worst 110 req/s (assumed 5 min to in service) |
| purchase month | baseline 3 × 24 h committed $60.48 + peak 3 × 6 h on-demand $21.60 + image worker 2 × 4 h Spot $3.84 = $85.92 (all on-demand $117.60) |
| container | ECR `order-api:1.4.2`; Fargate task 512 CPU / 1024 MiB ARM64; roles OrderApiExecution (pull, logs) + OrderApi (task); stopTimeout 30 s |
| statelessness | 300 carts on local disk across 3 servers: scale-in of app-2 loses 99; shared store loses 0 |
| buckets | `shop-catalog-<acct>` (versioned: noncurrent expire 30 d; `exports/` → STANDARD_IA 30 d → GLACIER 90 d), `shop-uploads-111122223333` (review photos, presigned PUT 300 s, key `reviews/p-1001/photo-77.jpg`), `shop-reports-111122223333` (SSE-KMS `alias/shop-reports`, bucket key), `shop-releases-111122223333` |
| S3 race | p-1001.json `{price 12.0, stock 40}`; price job → 10.0, stock job → 39; plain PUT ends `{12.0, 39}`, If-Match ends `{10.0, 39}` (moto) |
| block / file | invoice service: 30 GiB gp3 in eu-west-2a → snapshot → restored in eu-west-2b (moto); EFS `shop-invoices-1` mounted at /mnt/invoices in all three AZs |
| orders DB | RDS PostgreSQL 16 `shop-orders`, db.m7g.large, 100 GiB gp3, Multi-AZ (instance), encrypted, 7-day backups, deletion protection, password managed in Secrets Manager, subnet group `shop-data`, sg-db; max_connections 200 (assumed), 10 reserved, pool 20/server → 12 servers = 50 refused |
| order 501 | 2 × p-1001 (10.00, stock 40) + 2 × p-1002 (4.50, stock 1), total 29.00 → CHECK fails, rolled back (PostgreSQL 16) |
| access mix | product by id ~450 reads/s, place order ~6 writes/s, a customer's orders ~40 reads/s (evening peak, assumed) |
| DynamoDB | table `Orders` (PK customer, SK `<time>#<order>`), GSI `by-status` (2 values → hot key); `Stock`/`Orders` transaction: o-601 placed, o-602 ConditionalCheckFailed (moto) |
| cache | p-1001 12.0 → 10.0 at t=10 s, TTL 60 s: stale 10–60 s; delete-on-write: fresh at 20 s |
| migration | DMS task `orders-to-rds`, full-load-and-cdc, schema `shop` |
| API | REST API, model `Order` + validator `body-only`, Cognito authorizer `shoppers`, stage `prod` throttle 600 rps |
| functions | `place-order` (python3.13, arm64, 512 MB, timeout 10 s, role PlaceOrderFn, reserved concurrency 50; 0.12 s assumed → 67 needed at 560 req/s, 143/s throttled); also reserve-stock, charge-payment, ship-order, release-stock |
| lake | `s3://shop-lake-111122223333/order_history/`, Glue db `shop_lake`, table `order_history` (Parquet, partition dt); September 2026 history: 60,000 rows (2,000/day, seed 12); one day opens 629 KiB flat vs 24 KiB partitioned vs 220 KiB as 200 tiny files; 11–13 Sep sales 202,224.52 / 205,617.39 / 202,876.5 (DuckDB, labelled) |
| CDC 12 Oct | 6 records → 4 orders (o-502 replayed; o-504 at 23:58 arrived 00:04), 756.50 = source → reconciled |
| stream | Kinesis Data Streams `shop-clickstream`, provisioned, 2 shards; 1,800 rec/s vs consumer 1,600/s → ~11 min iterator age by 19:30, drains after 20:00 |
| IaC | stack `shop-prod` v14 → v15 (v15 fails at 18:41, rolled back; its migration had already run); order-events template: waves topic+DLQ → queue → policy+subscription; replacement from schemas: RDS StorageEncrypted, SQS QueueName |
| release | order-api 1.5.0 fails 2%: failed requests before a 2-min alarm at 560 req/s — all at once 1,344, linear 10%/min 202, canary 10% 134; CodeDeploy `CodeDeployDefault.ECSLinear10PercentEvery1Minutes` |
| promotion | commit 9f3c2e1 → one image digest → dev, then prod; pipeline role `ShopPipeline` (dev 444455556666) is the only principal prod's `ShopDeploy` trusts |
| messaging | SQS `fulfilment`; SNS `order-events` → fulfilment, loyalty, fraud-check (total ≥ 500); EventBridge rules `uk-vat` (OrderPlaced, GB), `refunds`; DynamoDB `idempotency` (keys `ship#o-501`, `key#k-91`) |
| telemetry | 18:04 → 18:06: p50 112 → 114 ms, p99 132 → 1020 ms; 20 slow traces, 90% waiting for a DB connection |
| objective | checkout 99.9% over 30 days, ~6/s → budget 15,552; 2% errors burn 20× (1.5 days); alarm `checkout-5xx-fast-burn` (5xx > 50/min, 5 of 5) → SNS `ops-pager` |
| audit | PutBucketPolicy on shop-reports at 18:12:44 by sam (AWSReservedSSO_ShopOperator) from 203.0.113.24; event history 90 days, data events off |
| ops | Config rule `s3-no-public-read`; SSM patch group `order-api`; KMS key policy on the reports key (account admin, Auditor Decrypt); rotation 09:30 breaks cached password, re-read fixes at 09:31 |
| edge / incident | web ACL `shop-web` (rate 1,000/IP, AWSManagedRulesCommonRuleSet); OrderApi keys used from 198.51.100.66: detect 18:19, lead 18:21, revoke sessions before 18:20 at 18:24, preserve 18:30, eradicate 19:10 |
| recovery | backup plan `shop-daily` 02:00 UTC, 35 d in `shop-prod-vault`, copy 90 d to `shop-isolated` (audit 777788889999, eu-west-1); drill 02:00 → 03:06 = 66 min (RTO 90), PITR to 01:52 = 8 min (RPO 15) |
| saturation | one server modelled as 15 workers × ~100 ms: 60 req/s p99 171 ms, 120 → 187, 140 → 299, 147 → 873 (simulation, not AWS) |
| edge | Sydney shopper, assumed RTT 280 ms to London / 12 ms to edge: direct 952, hit 38, miss 428 ms; 90% hits → 77 ms; cache policy `product-pages` (path + lang, TTL 60 s, max 300) |
| capacity plans | large-h/day: fixed 96 (43% busy), elastic no reserve 52 (80%), AZ-safe large 90 (46%, = ASG 3 → 6), AZ-safe medium 78 (53%; medium = half a large at half price, assumed) |
| cost week | env=prod 93%, dev 5%, untagged 2%; NAT anomaly 10-09 42.20 vs median 3.80 (768 GB through NAT); budget `shop-prod-monthly` 400 USD, forecast 80% → email |
| rate card ext. | **hypothetical**: NAT $0.05/h + $0.05/GB, internet egress $0.09/GB, cross-AZ $0.02/GB, logs ingest $0.50/GB; committed instance $0.028/h (Ch. 4) |
| prod month | NAT gateways 109.50, app servers 108.00, egress 81.00, logs 30.00, backups 15.00, cross-AZ 8.00, NAT processing 6.00, S3 4.60 = 362.10; servers with commitment 82.08; break-even 70% |
| footprint | 90 → 78 large-h/day; logs 730 → 60 GB after a year (2 GB/day, 30-day retention); origin 900 → 90 GB/month at 90% hits |
| ADR-007 | order API on ECS Fargate + RDS PostgreSQL Multi-AZ; rejected EC2 (OS patching), Lambda + DynamoDB (PostgreSQL), EKS (skills); revisit at 5× peak |
| region case | assumed 2 s lag × 6 orders/s → ~12 orders lost at failover; health check 3 × 30 s + TTL 60 s → 150 s; active/active sells the last p-1002 twice |
| cutover | ALB weights EC2 `shop-app` / ECS `shop-ecs` 90/10 → 50/50 → 0/100; gate at 100%: 1,210 acked vs 1,207 stored → roll back, replay 3 |
| review | ranked: rotation 4.0, runbook link 4.0, cross-Region restore 3.0, NAT 3.0, untagged 3.0, log retention 3.0, p99 2.0, multi-Region active/active 1.0 |

Public IPs in examples come from `203.0.113.0/24` / `198.51.100.0/24` (documentation ranges). Extend this table — never change a value a
slide already quotes.

## Authoring conventions

- **Section shape:** objective → mental model → worked example → misconception → explanation
  summary (headings on the slide), bridge at the chapter's end. Explain a term before relying on it.
  Following along is optional; no exercises, assessments or "your tasks". Never claim the learner has
  achieved competence.
- **Introduce access, logs, cost and failure boundaries with their first operation**, deepen later.
- **Label variants before claiming behaviour** (RDS Multi-AZ instance vs cluster vs Aurora; DynamoDB
  table/index, regional/global; Lambda sync/async/event-source mapping; which Kinesis service).
- **Slides:** target 860–1020 rendered px (the `shot` script's 80–95 %). One line per bullet wherever
  possible — a wrapped bullet costs ~38 px. Inline code **wraps badly** (`eu-west-2` broke across two
  lines); write identifiers as plain text on slides when they would sit at a line end.
- **Narration is written for the speech engine:** spell acronyms as letters — "A W S", "E C two",
  "S three", "I A M", "V P C", "A R N", "S D K", "C L I", "A P I", "D N S", "H T T P S", "M F A",
  "S T S", "R D S", "J S O N"; "Route fifty three"; "E U west two"; account ids digit by digit in
  groups ("four four four four, five five five five, six six six six"); prices as words. Every fact
  on a slide gets its sentence in the narration.
- **Out of scope** (per the plan): advanced Kubernetes, landing-zone implementation, specialised
  networking, database internals, full data-engineering platforms, ML/AI, IoT, media, HPC; SQL, Python,
  Spark, system design and Databricks have their own courses.

## Scene inventory

| Scene id | Shape | Used by |
| --- | --- | --- |
| `product-page` | **shared.** Request container (shopper → Route 53 / load balancer → app servers → orders DB / images) above a demand-vs-capacity plot. Later chapters reuse it with `focus:` on `browser`, `dns`, `lb`, `app`, `db`, `images` — keep those ids stable | `foundations-cloud-operating-model` |
| `responsibility-matrix` | job × EC2/RDS/Lambda/S3 table above an incident → owner list | `foundations-shared-responsibility` |
| `region-boundaries` | Region container (3 AZ containers of app chips, AZ c red, + Regional services) above global services and the N+1 list | `foundations-regions-and-availability-zones` |
| `first-session` | `~/.aws/config` → sso login / get-caller-identity → STS response | `foundations-accounts-and-first-session` |
| `api-call-anatomy` | request container (head-object CLI + call-path list) above the HeadObject response and ARN shapes | `foundations-api-request-walkthrough` |
| `cost-ledger` | `cost_ledger.py` → its real output | `foundations-billing-and-cleanup` |
| `identity-center-map` | identity source → Identity Center → assignments table → AWSReservedSSO roles per account; principal kinds list | `identity-principals-and-federation` |
| `order-api-role` | trust + permissions JSON → create-role CLI → "on the app server" list | `identity-roles-and-trust` |
| `policy-anatomy` | the 3-statement OrderApiAccess policy above a four-questions list | `identity-policy-statements` |
| `evaluation-flow` | decision row (explicit Deny / Allow / nothing) → DenyDrafts JSON → permission matrix (moto-verified) → illustrative AccessDenied | `identity-policy-evaluation` |
| `cross-account-read` | bucket policy + Auditor policy side by side above the which-Allows table | `identity-resource-policies-cross-account` |
| `org-structure` | org root → Security OU / Workloads OU (Prod, Dev) above the isolation table | `identity-organizations-and-isolation` |
| `guardrails` | region SCP + org-only RCP side by side above the policy-kinds table | `identity-guardrails-and-audit` |
| `cidr-plan` | `cidr_plan.py` → output, above a ports table | `networking-addresses-and-cidr` |
| `vpc-layout` | VPC container: 3 AZ columns × public/app/data subnets; placement-rules list | `networking-vpc-and-subnet-layout` |
| `route-selection` | rt-public + rt-app-a tables → `route_pick.py` beside its output | `networking-route-tables` |
| `private-egress` | timeout symptom → NAT fix CLI → who-can-start-a-connection table | `networking-public-and-private-connectivity` |
| `traffic-filters` | sg-alb / sg-app / sg-db row → AuthorizeSecurityGroupIngress request → SG vs NACL table | `networking-security-groups-and-nacls` |
| `dns-resolution` | resolution chain (TB) beside the alias UPSERT request; routing-policy list | `networking-dns-and-route-53` |
| `tls-path` | browser → ALB → app → DB column beside the ACM/listener CLI and per-hop table | `networking-tls-and-certificates` |
| `lb-health` | create-target-group CLI → `health_timeline.py` → output | `networking-load-balancers-and-health` |
| `private-connectivity` | S3 gateway-endpoint policy above the private-paths table | `networking-private-connectivity` |
| `compute-choice` | EC2/Fargate/Lambda/EKS 2×2 → comparison table → order-API shape list | `compute-compute-selection` |
| `launch-template` | CreateLaunchTemplate request beside the instance-state column | `compute-ec2-and-launch-templates` |
| `purchase-options` | m7g.large anatomy 2×2 → `purchase_mix.py` → output | `compute-instance-types-and-purchasing` |
| `bootstrap-and-ssm` | user-data.sh → SSM session/patch CLI → "still ours" list | `compute-bootstrap-and-systems-manager` |
| `scaling-timeline` | `surge.py` → output → PutScheduledUpdateGroupAction request | `compute-auto-scaling` |
| `ecs-task` | RegisterTaskDefinition request above the VM-vs-container table | `compute-containers-ecr-ecs` |
| `eks-choice` | illustrative Deployment manifest → worth-it/costs table → verdict | `compute-eks-and-kubernetes` |
| `stateless-design` | `carts.py` + output, `drain.py` (SIGTERM) + output | `compute-stateless-and-graceful-shutdown` |
| `storage-kinds` | S3/EBS/EFS row → choice table → persistence list | `storage-object-block-file` |
| `presigned-upload` | 4-step upload column beside `presign_upload.py` (real SigV4) + output | `storage-s3-access-paths` |
| `concurrent-writers` | `two_writers.py` (moto) + output | `storage-s3-consistency-and-concurrency` |
| `version-timeline` | `versions.py` (moto) + output beside the lifecycle request | `storage-versioning-and-lifecycle` |
| `ebs-snapshot` | `snapshot_restore.py` (moto) + output | `storage-ebs-and-snapshots` |
| `shared-files` | EFS mount row → CreateFileSystem request → FSx table | `storage-shared-file-storage` |
| `data-protection` | PutBucketEncryption request above the threat × protection table | `storage-encryption-and-backup` |
| `access-patterns` | access-pattern table → data-model row → questions list | `databases-data-requirements` |
| `rds-instance` | CreateDBInstance request above the who-does-what table | `databases-rds-and-aurora` |
| `order-transaction` | `place_order.sql` (PostgreSQL) + output beside `connections.py` + output | `databases-transactions-and-connections` |
| `rds-availability` | five-option capability table → which-one-saves-you list | `databases-availability-read-scaling-restore` |
| `dynamodb-keys` | `orders_table.py` (moto) + output | `databases-dynamodb-keys-and-indexes` |
| `dynamodb-conditions` | `last_unit.py` (moto) + output beside the read-consistency table | `databases-dynamodb-conditions-and-consistency` |
| `cache-aside` | `cache_aside.py` above its two timelines | `databases-caching-and-stale-reads` |
| `migration-and-specialists` | DMS CLI + table mappings above the specialist table | `databases-migration-and-specialist-databases` |
| `api-contract` | order schema + API Gateway CLI; rejected responses + checks list | `integration-api-gateway` |
| `lambda-handler` | `handler.py` + output beside the CreateFunction request | `integration-lambda-execution` |
| `concurrency-limits` | `concurrency.py` + output above reserved-concurrency request + execution role | `integration-lambda-concurrency` |
| `queue-consumer` | `consumer.py` (moto) + output above the standard/FIFO table | `integration-sqs-queues` |
| `sns-fanout` | three-queue row above `fan_out.py` (moto) + output | `integration-sns-fanout` |
| `event-routing` | `routing.py` (moto) + output | `integration-eventbridge-routing` |
| `order-workflow` | state diagram beside the checked ASL definition | `integration-step-functions` |
| `idempotency` | `idempotent.py` (moto) + output beside the retry-ownership table | `integration-idempotency-and-retries` |
| `integration-choices` | end-to-end order flow above the which-mechanism table | `integration-choosing-integration` |
| `state-vs-history` | DB → S3 → Glue → Athena row above `history.py` + output | `analytics-operational-vs-analytical` |
| `cdc-reconcile` | `reconcile.py` + output above the ingestion-choices table | `analytics-ingestion-and-reconciliation` |
| `lake-layout` | `layout.py` (real Parquet) + output | `analytics-lake-layout` |
| `glue-catalog` | Glue CreateTable request above the three-promises table | `analytics-glue-catalog-and-governance` |
| `athena-query` | `daily_sales_duckdb.py` + output → Athena CLI | `analytics-athena-queries-and-cost` |
| `stream-lag` | `consumer_lag.py` + output → CreateStream request | `analytics-kinesis-streaming` |
| `warehouse-or-cluster` | Athena/Redshift/EMR row → selection table → caution list | `analytics-redshift-and-emr` |
| `declarative-vs-imperative` | script and template stacked above table + principles row | `delivery-declarative-infrastructure` |
| `stack-template` | order-events template beside `create_order.py` (topological waves) | `delivery-cloudformation-stacks` |
| `params-and-secrets` | config template beside `secrets_lint.py` (cfn-lint findings) | `delivery-parameters-outputs-secrets` |
| `change-sets` | `replacement_preview.py` (AWS provider schemas) above the change-set limits table | `delivery-change-sets-and-drift` |
| `rollback-and-protection` | protected orders-db template above illustrative failed-update events | `delivery-rollback-and-stateful-resources` |
| `deployment-strategies` | blue/green row → `traffic_shift.py` → CodeDeploy CLI | `delivery-cicd-and-deployment-strategies` |
| `promotion-and-tools` | build/dev/prod row → prod deploy trust policy → CFN/CDK/Terraform table | `delivery-promotion-and-provenance` |
| `telemetry-correlation` | metric/log/trace row above `latency_incident.py` + output | `operations-telemetry-and-correlation` |
| `slos-and-alarms` | `error_budget.py` + output above the PutMetricAlarm request | `operations-objectives-and-alarms` |
| `cloudtrail-evidence` | illustrative CloudTrail record → lookup CLI → which-evidence table | `operations-cloudwatch-versus-cloudtrail` |
| `ops-access` | SSM fleet CLI → PutConfigRule request → questions table | `operations-operational-access-and-inventory` |
| `keys-and-rotation` | KMS key policy beside `rotation.py` + output | `operations-keys-secrets-and-rotation` |
| `edge-and-detection` | CreateWebACL request beside the prevents-or-detects table | `operations-layered-exposure-and-detection` |
| `incident-containment` | five-step timeline beside the revoke-older-sessions policy | `operations-incident-triage-and-containment` |
| `backup-and-restore` | CreateBackupPlan request → `restore_drill.py` → output | `operations-backup-and-restore-validation` |
| `disaster-recovery` | `rpo_by_incident.py` + output above the DR strategies table | `operations-disaster-recovery-and-failover` |
| `quotas-and-resilience` | quotas table → `backoff_jitter.py` + output → quotas CLI | `operations-quotas-throttling-and-resilience` |
| `saturation-curve` | `saturation.py` above its output beside the saturation-signals table | `optimisation-measurement-and-saturation` |
| `edge-caching` | `edge_latency.py` → output beside cache-key table → CreateCachePolicy request | `optimisation-cloudfront-and-caching` |
| `capacity-plans` | AZ-safe capacity vs demand plot → `capacity_plans.py` → output | `optimisation-rightsizing-and-idle-capacity` |
| `cost-allocation` | `cost_lines.py` + output above Cost Explorer CLI beside CreateBudget request | `optimisation-cost-allocation-and-budgets` |
| `monthly-cost` | `monthly_cost.py` + output above the purchase-options table | `optimisation-total-cost-trade-offs` |
| `sustainability-levers` | `footprint.py` + output above the lever/constraint table | `optimisation-sustainability-trade-offs` |
| `decision-record` | requirements × options table above the illustrative ADR-007 | `architecture-requirements-and-decisions` |
| `platform-alternatives` | three request-path columns (VMs, containers, serverless) above the what-moves table | `architecture-platform-comparison` |
| `region-choices` | `region_failure.py` + output above the how-far-to-spread table | `architecture-regional-choices` |
| `staged-cutover` | ModifyListener weights request → `cutover_gates.py` + output → rollback-boundaries table | `architecture-migration-and-cutover` |
| `well-architected-review` | six-pillar evidence table above `priorities.py` + output | `architecture-well-architected-review` |

## Engine notes (flow 1.3.0 / shell 0.10)

- **Icons resolve AWS → Azure → lucide → the pattern's default.** AWS service keys exist (`ec2`,
  `s3`, `rds`, `elb`, `route53`, `iam`, `cloudfront`, `lambda`, `dynamodb`, `sqs`, `sns`,
  `cloudwatch`, `cloudtrail`, `kms`, `budgets`, `costexplorer`, `organizations`, …).
  `npm run check` now **guards icon names** (`scripts/check-icons.mjs` reads the bundle's maps and
  lists every valid key when one is wrong).
- `kind: 'plot'` draws data series (line/area/marker) — used for demand vs capacity.
- **Container headings shrink to their children's width** and wrap: "AZ eu-west-2a" over two chips
  wrapped onto three lines. Keep such headings to a word or two; put detail on the parent.
- A row of wide code cards scales the whole scene down: restack toward the pane's ~1:1 aspect
  (`cols: 1`, or a two-up row container above full-width cards).
- A long JSON value (an assumed-role ARN) sets the card's width; acceptable in a single-column stack.
- `padding` 0.12–0.13 clears the eyebrow for boards that bind on height.
- **Edges are all-or-nothing on a board's top level.** If some top-level nodes have edges and others
  do not, the unconnected ones are placed in the first rank beside the chain and widen the board.
  Chain every node, or use none and let `cols` lay them out.
- **A code-card filename is `name.ext · level`** — nothing else may follow the extension (a
  parenthetical broke level parsing); say "DuckDB, not Athena" in the narration and scene comment.
- **Never re-indent a template literal when restructuring a scene** (done twice; the second time the
  program still ran identically, so nothing caught it). Generate a scene with the literal inserted
  verbatim, then compare the card text to its source program. Code-card text is the literal;
  re-indenting changed a `runs locally` card's output (caught by check:aws) and a `.sh` card's layout
  (not caught — look at the route).
- The shell 0.10 catalog collapses courses, so section links are not in the DOM; `shot.mjs` reads
  slugs from `src/content` instead.

## Invariants — do not break

- **Never write `x` or `y`.** Scenes are declarative: nodes, edges, nesting.
- **Do not reimplement the shell** (`SectionView`, `CourseIndex`, `SlidePanel`, hooks).
- **`SiteHeader` goes on the catalog page only.**
- **Three stylesheets, in cascade order** in `main.tsx`: flow, shell, then `./theme.css` last.
- **`file:../ui-flow` / `file:../ui-shell` must never be committed.**
- **Narration is never hand-produced.** `.tts` → `.wav` via Colab + Chatterbox only
  (`npm run gen:audio` writes `scripts/audio-manifest.json` for that pass).

## Guards — run all before handing over

```sh
npx tsc --noEmit && npm run build && npm run check && npm run check:aws
npm run dev &                        # then:
node scripts/shot.mjs <outDir> [slug …]   # 1920×1080 renders; reports clipping, density, eyebrow
```

`check` = layout budgets + icon names + plan conformance. `node scripts/measure-slides.mjs` models
slide height offline (±3.5 %). All of these are a **floor, not proof** — look at the rendered route.

## Working agreement

- **Author the whole unit, then hand over the route.** Scenes, slides and narration together.
- **No ASCII sketches of scenes.**
- **No silent scaffolding**, no work outside the ask. Say plainly what was built, what was verified,
  and what was left out.
