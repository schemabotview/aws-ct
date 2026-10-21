# AWS — from an empty account to a running shop

**Status: reset on 2026-10-21 and re-planned around one project, built step by step.** This plan is
awaiting the owner's review; no course is authored. Courses are authored one at a time, each reviewed
by the owner on its rendered routes before the next begins. The method is python-ct's and
apache-spark-ct's, applied to AWS.

## The idea

The course builds **one application — an online shop — from an empty AWS account to a production
system that is secured, networked, scaled, automated, observed, recoverable and costed**, and every
AWS idea is taught at the moment the shop first needs it. Courses are named by **what we build**,
not by service catalogue, so the whole course is one story a learner can hold in their head:

> *Why the cloud → how AWS runs a request → start the project → lock it down → give it a network →
> run it → make it repeatable → store its files → keep its orders → decouple the checkout → report
> on sales → operate it → measure, tune and evolve it.*

| Part | For | Leaves you able to |
| --- | --- | --- |
| 0 — The picture (Courses 1–2) | everyone | say what the cloud changes, and what happens when AWS receives a request |
| I — Build it (Courses 3–7) | someone who knows files, processes and basic HTTP | put a web application on AWS safely, and rebuild it from a template |
| II — Grow it (Courses 8–11) | someone who can run an app on AWS | choose storage and databases, decouple work, and report on the data |
| III — Keep it running (Courses 12–13) | someone who owns a workload | observe, secure and recover it, then tune its cost and justify its architecture |

**Audience.** Learners new to AWS who understand files, processes and applications. IP addressing,
HTTP, DNS, identities and cloud vocabulary are introduced where needed. Reading simple Python, SQL,
shell and JSON/YAML helps; the syntax used is explained. Advanced programming, Kubernetes and
distributed-systems expertise are not prerequisites.

**Scope.** A general AWS course, independent of certification tracks, following one representative
workload through its lifecycle. No AWS account, paid deployment, submitted exercise or learner
monitoring is required; following along is optional. Out of scope: advanced Kubernetes, landing-zone
implementation, specialised networking, database internals, full data-engineering platforms, ML/AI,
IoT, media and HPC. SQL, Python, Spark, system design and Databricks have their own courses; Course
11 ends where the Spark and Databricks courses begin.

**Target.** Understand how to construct and explain a representative AWS workload, trace requests and
data across service boundaries, and justify security, reliability, performance, delivery and cost
decisions. The course never claims assessed production competence.

## The spine: `shop-on-aws`

The shop is the one in `CLAUDE.md`'s fixed-example table, unchanged: `shop.example.com` in
`eu-west-2`, production account 111122223333 and development 444455556666, the product page
`GET /products/p-1001`, the 60 / 240 / 560 req/s day, the hypothetical rate card. Every number a
frame quotes comes from that table, and the table is extended, never edited.

What changes is that the shop is now **one real project that grows**. A shopper loads a product
page, adds to a cart and places an order; the order is stored, paid, fulfilled and notified; the
day's sales are reported. Each course adds the AWS pieces that the next requirement forces:

| Course | The shop gains | Its map gains |
| --- | --- | --- |
| 3 `start` | a project, a profile, a first tagged bucket, a cost ledger | the account and one bucket |
| 4 `secure` | the OrderApi role and its policies, two accounts in an organization | accounts, roles, the trust arrow |
| 5 `network` | `shop-prod` VPC, nine subnets, routes, NAT, security groups, DNS, TLS, the ALB | the whole request path, shopper → ALB |
| 6 `run` | the order API on EC2 behind an Auto Scaling group, then as a Fargate service | app servers in three AZs |
| 7 `automate` | the network and app as CloudFormation stacks, and a release pipeline | stacks drawn around what they own |
| 8 `files` | the catalog, uploads and reports buckets; a volume; shared files | S3, EBS, EFS beside the app |
| 9 `orders` | RDS PostgreSQL, a DynamoDB table, a cache | the data tier |
| 10 `decouple` | API Gateway, the place-order function, queue, topic, bus and workflow | the asynchronous checkout |
| 11 `report` | an S3 lake, a Glue table, Athena, a clickstream | the analytical side |
| 12 `operate` | telemetry, alarms, audit, keys, WAF, backups, a DR plan | the controls around everything |
| 13 `evolve` | an edge cache, rightsizing, a cost month, an ADR and a review | the same map, priced and judged |

Variants are compared under explicit assumptions — VM, container and serverless versions of the same
order API — and the shop does **not** accumulate every service into one design: the map shows what
the shop actually runs, and a compared alternative is drawn beside it, never inside it.

The finished project, toured in Course 3 and built from an empty folder from there on:

```
shop-on-aws/
  env.sh                         Region, profile, and the one line that points at the emulator (3)
  aws-config                     the profiles shop-dev and shop-prod                           (3)
  infra/                         the CLI scripts, one per step, in run order                   (3 → 6)
    01-bucket.sh                 the first tagged bucket                                       (3)
    04-roles.sh                  OrderApi's role and instance profile                          (4)
    05-network.sh                VPC, subnets, routes, NAT, security groups                    (5)
    06-servers.sh                launch template, target group, Auto Scaling group             (6)
    teardown.sh                  everything above, removed in reverse                          (3 → 6)
  policies/                      every IAM, bucket, key and guardrail policy as JSON           (4 → 12)
  app/                           the order API, Python                                         (6 → 9)
    server.py                    product page, cart, place order, /health                      (6)
    Dockerfile                   the same app as an image                                      (6)
  templates/                     CloudFormation, one stack per concern                         (7 → 12)
    network.yaml  app.yaml       what 05- and 06- built, declared                              (7)
    storage.yaml                 the buckets, the volume, the file system                      (8)
    orders.yaml                  the database, the table, the cache                            (9)
    checkout.yaml                API, function, queue, topic, bus, workflow                    (10)
    lake.yaml                    lake bucket, Glue database and table, stream                  (11)
    ops.yaml                     alarms, trail, config rule, backup plan, web ACL              (12)
  pipeline/                      build and deploy definitions, two accounts                    (7)
  db/                            schema.sql and place_order.sql (PostgreSQL 16)                (9)
  functions/place_order/         the Lambda handler                                            (10)
  workflow/order.asl.json        the order workflow                                            (10)
  jobs/                          export, reconcile, daily sales                                (11)
  tools/                         the calculations: cost ledger, CIDR plan, capacity, budgets   (3 → 13)
  ops/runbooks/                  incident and restore runbooks                                 (12)
  docs/adr/007-order-platform.md the decision record                                           (13)
```

## Building the infrastructure: the CLI first, then templates

**Courses 3–6 build the shop imperatively, one script per step, with the real AWS CLI.** Every
API call is visible as a command, which is what makes Course 2's "every action is an API call"
concrete. The scripts teach the habits real ones need: `--query` and `--output text` to capture ids
into variables, waiters, a tag on every resource, and a `teardown.sh` that grows with them (cleanup
is a cost lesson, introduced with the first resource).

**Course 7 opens by re-running `05-network.sh`** — a second VPC, then a conflict — which is the
reason templates exist. From there the network and the app are declared in CloudFormation, deployed
with `aws cloudformation deploy`, and every later course adds its resources to a template rather
than a script. The CLI stays for what it is for: reading state, calling the data plane (`s3 cp`,
`put-item`, `send-message`) and investigating.

**Why not the console.** A click leaves nothing that can be replayed or checked. One concept frame
in Course 2 shows that the console, the CLI and the SDKs are three clients of the same API.

## Three kinds of frame, plus one

Every section is **one full-screen frame and one narration** (90–180 s), no slide. AWS is
diagram-first, so the default here is the map, not the IDE:

1. **Map frame** — the shop's architecture diagram, the ONE fixed layout that grows through the
   course the way the file tree grows in the Spark course. What this section adds is marked `NEW`,
   what it changes is in focus, the rest is dimmed; an alternative is drawn beside the map, never
   inside it. Every component keeps the same id and the same place from the course it appears in
   to the end, so a learner always knows where they are.
2. **Map + terminal frame** — the map on the left, and on the right the script being run over its
   real output (`create-subnet` printing the subnet id; the `AccessDenied` a policy produces). The
   AWS version of Spark's IDE + model frame.
3. **IDE frame** — the python-ct / Spark template (explorer | editor over terminal | side pane) where
   the point is a FILE: a policy, a template, the app, a handler, a state machine, a calculation.
   One file per frame; a long one is folded with `show`, a long run with `fold`.
4. **Concept frame** — where there is no command at all: an AZ failing, a packet's path, a
   responsibility split, DR strategies on a cost/recovery axis.

Each section below is tagged `map`, `map+term`, `ide` or `concept`. The split is roughly 30 / 30 /
25 / 15; it will be confirmed when Course 1 is drawn.

## How a section teaches

- **One step per section.** A section makes one change to the shop and shows its effect.
- **Code is executed, not pasted.** The project lives in this repo as snapshots, one per section
  that changes it (`spine/<course>/<step>/`: `project/`, `session.txt`, `step.json`). Scenes import
  the files with `?raw`, and `npm run check:spine` replays every step in a fresh copy against a fresh
  emulator and fails on any difference.
- **Failure is taught, not hidden.** Many sections run the wrong version first — the denied request,
  the conflicting subnet, the app that cannot reach the payments API — then fix it.
- **Evidence over assertion.** Where AWS's behaviour is the point, the terminal shows it: the caller
  identity, the denied action, the chosen route, the replaced resource in a change set.
- **Access, logs, cost and failure boundaries arrive with the first operation that has them**, and
  are deepened later. Variants are labelled before behaviour is claimed (RDS Multi-AZ instance vs
  cluster vs Aurora; DynamoDB table vs index; Lambda sync / async / event-source mapping; which
  Kinesis service).
- **The Well-Architected pillars are recurring questions**, asked of decisions, not a checklist.
- **Narration explains; the frame shows.** It never reads a command aloud character by character.
  Acronyms are spelled for the speech engine as in `CLAUDE.md`.

## What the emulator is, and what it cannot show

Terminals run **the real AWS CLI v2 and boto3 against a local moto server** (`AWS_ENDPOINT_URL` in
`env.sh`, the account set with `MOTO_ACCOUNT_ID`). The same script would run against a real
account without that line. Every such pane is labelled **emulated**, the existing `check:aws` level,
and nothing emulated is ever presented as AWS's own output.

moto records API state and enforces much of the API contract — validation, conflicts, IAM policy
evaluation when enabled, conditional writes, queue visibility. It does **not** move packets, run an
instance's software, fail over a database, serve from an edge, evaluate SCPs/RCPs or cross-account
access, or return real Athena results. Those claims are made another way, and the frame says which:

| claim | how it is shown |
| --- | --- |
| the app's own behaviour | the app runs locally, really (`runs locally`) |
| routing, filtering, health, capacity, latency | a small simulation in `tools/`, run for real, labelled a model |
| SQL results | PostgreSQL 16 for the orders database; DuckDB for the lake query, labelled "DuckDB, not Athena" |
| templates and requests | cfn-lint and botocore's models (`model-checked`) |
| SCPs, RCPs, failover, edge, quotas | the AWS documentation, cited in the scene (`doc-cited`) |

**Replay normalisations**, stated once and applied everywhere, like Spark's path normalisation: the
emulator's random ids (`vpc-…`, `subnet-…`, `i-…`) are replaced by stable ones that match the facts
table, and the emulator's endpoint in a printed URL is replaced by the real regional endpoint.
Nothing else in an output is edited.

## The courses — 13 courses, 104 sections

Every topic of the previous plan's twelve chapters is kept; the map from old chapter to new course
is at the end.

### Part 0 — The picture

**1. `why-cloud` · Why the cloud · 5 sections**
1. One shop, one server — the product page on a machine you own, and what an evening peak does to it · concept
2. Renting instead of owning — on-demand capacity, elasticity, and the 1 / 2 / 4-server day · concept
3. Managed services — what AWS runs for you, from a virtual machine to a queue · concept
4. Shared responsibility — infrastructure, configuration, application and data ownership across EC2, RDS, Lambda and S3 · concept
5. What we will build — the finished shop on one map, and the course as its route · map

**2. `how-aws-runs` · How AWS runs a request · 6 sections**
1. Regions and Availability Zones — where the shop runs, and which failure each boundary contains · concept
2. Global, Regional and zonal services — IAM, S3 and EC2, and what "in eu-west-2" means · concept
3. Every action is an API call — the console, the CLI and the SDKs as three clients of one endpoint · concept
4. Anatomy of a request — endpoint, signature, identity, Region, action and resource in one call · map+term
5. ARNs and resource identity — naming a thing across services, accounts and Regions · concept
6. What keeps charging — per hour, per GB, per request, and what still bills when compute is stopped · concept

### Part I — Build it

**3. `start` · Start the project · 6 sections**
1. The finished project, toured — every folder in `shop-on-aws`, and what it is for · ide
2. The account and its root user — what to lock away, MFA, and why nobody works as root · concept
3. A first session — an SSO profile, a temporary credential, and `get-caller-identity` · map+term
4. The emulator beside AWS — the same CLI, one endpoint line, and what it cannot show · ide
5. The first resource — a tagged bucket, created, listed, and its first error · map+term
6. Billing, budgets and cleanup — the cost ledger, a budget that is not a cap, and `teardown.sh` · ide

**4. `secure` · Lock it down · 8 sections**
1. Principals, authentication and federation — people through IAM Identity Center, workloads through roles · map
2. Accounts and environments — Organizations, OUs, and why production and development are separate accounts · map
3. A role for the app — OrderApi's trust policy, and how it differs from its permissions · ide
4. Assuming the role — STS, temporary credentials, and what expires · map+term
5. Policy statements — actions, resources, effects and conditions in OrderApiAccess · ide
6. Why a request is denied — implicit deny, explicit deny, and the effective permissions, checked with IAM enforcement on · ide
7. Resource policies and cross-account access — the Auditor reading the reports bucket from another account · ide
8. Guardrails and audit ownership — SCPs, RCPs, delegated administration, and who owns the trail · ide

**5. `network` · Give it a network · 9 sections**
1. Addresses, CIDR and ports — 10.20.0.0/16 cut into nine subnets, and what a port and a protocol are · ide
2. A VPC across three AZs — `05-network.sh`, the public, app and data subnets, and an interface on each server · map+term
3. Route tables — local routes, the internet gateway, and how the most specific route wins · map+term
4. Going out from a private subnet — NAT, and the app that cannot reach the payments API · map+term
5. Security groups and network ACLs — sg-alb → sg-app → sg-db, stateful against stateless · map+term
6. A name for the shop — Route 53, an alias record, and the routing policies · map+term
7. TLS along the path — a certificate, where encryption ends, and why reachability is not encryption · map
8. The load balancer — a target group, health checks, and app-3 marked out and back in · map+term
9. Private paths and hybrid links — VPC endpoints, peering, Transit Gateway, VPN and Direct Connect boundaries · concept

**6. `run` · Run the app · 9 sections**
1. The order API — `app/server.py` run locally, one product page served · ide
2. Choosing compute — EC2, Fargate, Lambda and EKS by control, operational effort and latency · concept
3. A server from a template — an AMI, launch template order-api v14, IMDSv2, and the instance lifecycle · map+term
4. Instance types and paying for them — Graviton, families, on-demand, commitments and Spot · ide
5. Bootstrap and Systems Manager — user data, a session instead of SSH, and the patches still ours · ide
6. Auto Scaling — one server per AZ, health replacement, the evening-peak schedule and its delay · map+term
7. Containers — the image in ECR, a Fargate task definition, and its two roles · ide
8. When Kubernetes pays — EKS, and the requirements that justify its added complexity · concept
9. Stateless and graceful — carts on local disk, a SIGTERM, and a clean scale-in · ide

**7. `automate` · Make it repeatable · 8 sections**
1. When the scripts stop scaling — `05-network.sh` run twice: a second VPC, then a conflict · map+term
2. Declarative infrastructure — desired state, resource ownership, dependencies and repeatability · concept
3. A first stack — the network as a CloudFormation template, deployed and described · ide
4. Parameters, outputs and references — `!Ref`, `!GetAtt`, exports, and why a secret never sits in a template · ide
5. Change sets and drift — what an update will replace, and what a review cannot promise · ide
6. Rollback and stateful resources — a failed update, deletion and update policies, and the migration that had already run · ide
7. Releasing the app — an artefact, a deployment identity, and rolling, blue/green and canary · map+term
8. One artefact, two accounts — promotion, provenance, and CDK and Terraform as alternatives · map

### Part II — Grow it

**8. `files` · Store its files · 7 sections**
1. Object, block and file — three interfaces, and what each keeps when a server is replaced · concept
2. The catalog bucket — keys, requests, the bucket policy, and a product page's JSON put and got · map+term
3. Uploads without credentials — a presigned PUT for a review photo · ide
4. Two writers, one key — strong consistency, last writer wins, and a conditional write · ide
5. Versions and lifecycle — delete markers, storage classes, and what retrieval costs · ide
6. Volumes and shared files — EBS, a snapshot restored in another AZ, EFS and the FSx choice · map+term
7. Encryption, replication and backup — KMS keys, bucket keys, and what each one protects against · ide

**9. `orders` · Keep its orders · 9 sections**
1. What the orders need — data models, access patterns, transactions, latency and growth · concept
2. The orders database — RDS PostgreSQL in the data subnets, Aurora, and what "managed" covers · map+term
3. Placing an order — a transaction, a CHECK that fails, and the rollback · ide
4. Connections and credentials — a pool per server, fifty refused, and a password in Secrets Manager · ide
5. Availability, read scaling and restore — Multi-AZ instance, Multi-AZ cluster, Aurora, replicas and point-in-time restore · concept
6. A key-value table — DynamoDB partition and sort keys, an index, capacity, and a hot key · ide
7. The last unit in stock — conditional writes, transactions and read consistency · ide
8. Caching the product page — cache-aside, expiry, invalidation and the stale price · ide
9. Migration and specialist databases — DMS full load and CDC, and the engines the shop does not need · ide

**10. `decouple` · Decouple the checkout · 9 sections**
1. An API in front — API Gateway, a request contract, an authorizer, validation and throttling · map+term
2. A function to place the order — the Lambda handler, its environment, initialisation, reuse and timeout · ide
3. Concurrency and what is behind it — execution role, reserved concurrency, and the database it protects · ide
4. A queue for fulfilment — SQS polling, visibility, deletion, and standard against FIFO · ide
5. Fan-out — an SNS topic, three subscribed queues, and a filter · map+term
6. Event routing — an EventBridge bus, rules, schemas, and the VAT and refund rules · map+term
7. The order workflow — Step Functions state, branching, retries and compensation · ide
8. Doing it once — idempotency, backoff, dead-letter queues, replay and partial failure · ide
9. Choosing the mechanism — a synchronous API, a queue, a topic, a bus or a workflow, end to end · map

**11. `report` · Report on sales · 7 sections**
1. State against history — why the orders database is not the reporting system · concept
2. Getting the data out — batch export, CDC, transfer, and a day reconciled · ide
3. The lake's layout — columnar files, partitions by day, and small files · ide
4. The catalog and its governance — a Glue table, a schema change, and who may read which column · ide
5. Querying with Athena — the daily sales query, bytes scanned, and what it costs · ide
6. A stream of clicks — Kinesis Data Streams, shards, ordering, retention and consumer lag · ide
7. Warehouse or cluster — Redshift, EMR, and where the Spark and Databricks courses take over · concept

### Part III — Keep it running

**12. `operate` · Operate it · 10 sections**
1. Metrics, logs and traces — one slow evening correlated across all three · map
2. Objectives and alarms — 99.9% checkout, an error budget, and an alarm that pages · ide
3. CloudWatch against CloudTrail — runtime evidence, API activity, and what each records · ide
4. Operational access and inventory — Systems Manager, patching, and a Config rule · map+term
5. Keys, secrets and rotation — a key policy, application encryption, and the rotation that breaks a connection · ide
6. Layered exposure and detection — WAF, Shield, GuardDuty and Security Hub: which prevents, which detects · map
7. An incident — triage, containment, ownership and the runbook, for leaked role credentials · ide
8. Backups that restore — a backup plan, an isolated copy, and a timed restore drill · ide
9. RTO, RPO and disaster recovery — dependency recovery, failover, failback, and the four DR strategies · concept
10. Quotas, throttling and resilience — adjustable against fixed limits, backoff with jitter, and failure testing · ide

**13. `evolve` · Measure, tune and evolve it · 11 sections**
1. Measuring before tuning — throughput, latency distributions, and where saturation starts · ide
2. CloudFront and caching — edge delivery, origins, a cache key, and freshness · map+term
3. Rightsizing and idle capacity — utilisation, concurrency, and the AZ-safe plan · ide
4. Cost allocation and budgets — tags, Cost Explorer, a budget, and a NAT anomaly found · ide
5. The month's bill — transfer, requests, storage, logs, NAT and commitments, against hypothetical rates · ide
6. Sustainability trade-offs — utilisation, data movement and retention, under stated constraints · ide
7. Requirements and a decision record — constraints, alternatives, and ADR-007 · ide
8. Three ways to run the shop — VMs, containers and serverless, compared on one requirement set · map
9. One Region or more — multi-AZ, multi-Region, and what replication does to the data · ide
10. Migration and cutover — staged adoption, weighted traffic, reconciliation and rollback boundaries · map+term
11. A Well-Architected review — six pillars, the evidence for each, and what to fix first · ide

## Old chapter → new course

| Previous chapter | Now |
| --- | --- |
| 1 Foundations (6) | `why-cloud` 1–4, `how-aws-runs` 1–6, `start` 2–3, 6 |
| 2 Identity (7) | `secure` 1–8 |
| 3 Networking (9) | `network` 1–9 |
| 4 Compute (8) | `run` 2–9 |
| 5 Storage (7) | `files` 1–7 |
| 6 Databases (8) | `orders` 1–9 (caching and migration are now one section each) |
| 7 Integration (9) | `decouple` 1–9 |
| 8 Analytics (7) | `report` 1–7 |
| 9 Delivery (7) | `automate` 2–8, moved ahead of storage so every later resource is declared, not scripted |
| 10 Operations (10) | `operate` 1–10 |
| 11 Optimisation (6) | `evolve` 1–6 |
| 12 Architecture (5) | `evolve` 7–11 |

New with the spine: `why-cloud` 5, `start` 1, 4, 5, `run` 1, `automate` 1 — the project, the
emulator, and the moments the story needs.

## Decisions (resolved)

1. **Spine**: `shop-on-aws` — the online shop the previous plan used as its recurring example, now
   one real project, with its fixed facts kept.
2. **Stack**: AWS CLI v2 (2.38.4 at planning), boto3, moto 5.2.4 in server mode, Python 3.13,
   PostgreSQL 16, DuckDB, cfn-lint, all pinned in `spine/requirements.txt` when Course 3 is authored.
   Region `eu-west-2`. Every output on screen was produced by that stack; anything it cannot produce
   is shown another way and labelled (see the emulator table).
3. **The CLI first, templates from Course 7.** Infrastructure is scripted while each API is being
   learnt, then declared once the scripts' limits have been shown.
4. **Scene-only frames, no slides**, the template shared with python-ct and apache-spark-ct for IDE
   frames, and one fixed map layout for map frames.
5. **Engine and shell**: `@graphlearning/flow` ^2.2.0 and `@graphlearning/shell` ^0.14.0.
6. **Verification levels** (`runs locally`, `model-checked`, `emulated`, `doc-cited`,
   `illustrative`) and `check:aws` stay as they are in `CLAUDE.md`; `check:spine` is added beside it.
7. **Databricks** appears once, in `report` 7, as a pointer to its own course — not as part of the
   shop.

## Open for the owner

1. **13 courses, 104 sections** — one course more than the Spark and Python plans, because Delivery
   moved forward as its own course and Optimisation + Architecture became one. Trimming to 12 would
   mean merging `files` and `orders` (16 sections in one course) or dropping a Part 0 course.
2. **`automate` at Course 7** rather than after analytics. It makes Courses 8–13 template-based; the
   cost is that release strategies (canary, blue/green) are taught before the checkout exists.

## Sources and scope

The previous plan's sources still govern coverage (official AWS documentation researched on
2026-10-12: the AWS overview, the Well-Architected Framework and pillars, IAM policy evaluation,
Organizations, VPC and security groups, the storage and database decision guides, S3 consistency,
DynamoDB read consistency, RDS Multi-AZ and read replicas, Lambda execution and retries, SQS
delivery, CloudFormation and change sets, Service Quotas, disaster-recovery guidance, and Billing and
Cost Management), with *Amazon Web Services in Action* (3rd ed.) and the *AWS Cookbook* as coverage
checks only. Current primary documentation governs every technical claim, and prices and defaults
are re-checked when the section that quotes them is authored.

This document plans teaching material; it does not contain the completed lessons or executed
deployments.
