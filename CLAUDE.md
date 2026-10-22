# CLAUDE.md — aws-ct

> The workspace-level `CLAUDE.md` (one level up, in `graphl-workspace`) holds the invariants that
> span every repo. This file is only what is true *here*.

## What this repo is

The GraphL concept app for **AWS — from an empty account to a running shop**, authored from
**`AWS-COURSE-PLAN.md`** (re-planned 2026-10-21: 13 courses, 104 sections, one project `shop-on-aws`
built step by step; awaiting owner review). A **section** is `(scene, narration)` — one full-screen
frame, no slide — and one segment of the course video. The previous 12-chapter plan is in git history.

Engine `@graphlearning/flow@^2.2.0` (own renderer, react-flow removed); shell
`@graphlearning/shell@^0.14.0` (headerless section frames, `SCENE_ASPECT`). This repo's own
surface is `src/content/`, `src/scenes/`, `src/main.tsx`, `src/theme.css` and `scripts/`.

## Route contract

- Slug **`aws-ct`** — the GitHub repo name, the vite `base` (`/aws-ct/`) and the path under
  `graphl.in`. All three must be the same string.
- Routes: `#/` is the catalog; a section is `#/<courseId>-<sectionId>`, e.g.
  `#/foundations-billing-and-cleanup`. `?capture=1` and `window.__scene.plan()` come from the shell.
- Audio: `public/audio/<courseId>/<sectionId>.wav`. Section ids are unique within a course; scene ids
  are unique across the repo.

## Course arc and status

**Reset on 2026-10-21**: every course, scene, hidden verification and wav of the previous
12-chapter, slide-based course was deleted, and the subject re-planned in `AWS-COURSE-PLAN.md`
around one project built step by step (the python-ct / apache-spark-ct method).
`scripts/check-plan.mjs` reads the course ids, titles, section titles and frame tags from the plan,
so the plan is the only list of them.

| # | Course id | Course | Sections | Status |
| --- | --- | --- | --- | --- |
| 1 | `why-cloud` | Why the cloud | 5 | authored, awaiting owner review (no narration audio yet) |
| 2 | `how-aws-runs` | How AWS runs a request | 6 | authored, awaiting owner review (no narration audio yet) |
| 3 | `start` | Start the project | 6 | authored, awaiting owner review (no narration audio yet) |
| 4 | `secure` | Lock it down | 8 | authored, awaiting owner review (no narration audio yet) |
| 5 | `network` | Give it a network | 9 | authored, awaiting owner review (no narration audio yet) |
| 6 | `run` | Run the app | 9 | authored, awaiting owner review (no narration audio yet) |
| 7 | `automate` | Make it repeatable | 8 | authored, awaiting owner review (no narration audio yet) |
| 8 | `files` | Store its files | 7 | authored, awaiting owner review (no narration audio yet) |
| 9 | `orders` | Keep its orders | 9 | authored, awaiting owner review (no narration audio yet) |
| 10 | `decouple` | Decouple the checkout | 9 | authored, awaiting owner review (no narration audio yet) |
| 11 | `report` | Report on sales | 7 | authored, awaiting owner review (no narration audio yet) |
| 12 | `operate` | Operate it | 10 | planned |
| 13 | `evolve` | Measure, tune and evolve it | 11 | planned |

## Frames

Sections are **scene-only** (no `slide`; `check-content.mjs` fails on one). Four kinds, tagged per
section in the plan:

- **Map frame** — `mapFrame(id, built, side)` in `src/scenes/map.ts`: the shop's ONE architecture map
  (`shopMap`) at its natural size on the left, a side pane pinned to fill a 16:9 frame on the right.
  Every part is always drawn with the same label, so the map never moves; a part not built yet trades
  its AWS logo for a grey `box` outline (an AWS logo ignores `pattern`, so the logo itself has to go).
  `BUILT_BY[n]` is what the shop has at the end of course n. `MAP_W` × `MAP_H` (924 × 1078) is the
  map as `computeLayout` places it — re-measure if a part's label changes. `check-render.mjs` fails a
  map frame whose map or side pane moves.
- **IDE frame** — `ideFrame()` in `src/scenes/ide.ts`, the python-ct / Spark template: explorer 300 |
  editor 80 cols × 18 rows over terminal | side 520, 1632 × 918. A side pane holds tables and lists
  only, with SHORT cells: a code card has a minimum column count and can never fit 520, and a long
  table cell widens the pane — both move every panel, and `check-render.mjs` fails it. A file longer
  than 18 rows is folded with `show` or rewritten shorter; code lines stay within 80 columns.
- **Concept frame** — any scene; author wide, not tall (the frame is 16:9).
- **The explorer must fit its pane.** `projectTree(files, active, fresh, collapse, trim)`: folders in
  `collapse` show closed with a count unless the open or a new file is inside; folders in `trim` show
  only sub-folders and active/new files plus a muted `… N more files` (Course 11 on, for `infra`).
  `tools/` is full: later code goes in `analytics/`, `workers/` and other folders by role.
- **Ids:** `ideFrame` and `mapFrame` name their wrappers `<id>-explorer`, `<id>-centre`, `<id>-side`,
  `<id>-map`; a side pane's own root must not reuse one (use `<id>-pane`).

## The spine: commands are replayed, not pasted

Every terminal pane, and every file shown in an editor, comes from `spine/<course>/<NN-step>/`:
`project/` is a snapshot of `shop-on-aws/` (or a Course 2 demo, `project` key), `session.txt` is the
transcript, `step.json` the step's settings (documented in `scripts/spine.py`). Scenes import these
with `?raw`. `npm run check:spine` replays every step in a fresh copy and fails on any difference;
`python3 scripts/spine.py --write [course/NN]` regenerates after an edit.

What makes a replay deterministic, all of it about the machine:
- **The real AWS CLI v2 (2.38.4) and boto3, against a fresh moto server per step** on
  `localhost:5000` — the address `env.sh` names. A pane that shows one is titled `· emulated`.
- **moto is seeded** (`/moto-api/seed`), so `vpc-…`, `i-…` and request ids repeat exactly.
- **The clock is frozen** by libfaketime at the step's `time` (default 2026-10-12 09:30:00 UTC),
  and does not move, so timestamps, `X-Amz-Date` and SigV4 signatures repeat exactly.
- **In output, `http://localhost:5000` becomes the regional endpoint** the same call has on AWS
  (`https://<service>.eu-west-2.amazonaws.com`), except on a line that sets `AWS_ENDPOINT_URL`.
- Output is hard-wrapped at the pane's width: 84 columns in an IDE terminal, `"columns": 100` in a
  map frame's side pane. A command longer than that wraps too, and the replay rejoins it.
- Use `AWS_DEFAULT_REGION`, not `AWS_REGION`: boto3 1.43 ignores the latter and signs for us-east-1.
- **IAM enforcement** (`"enforce_iam": true`) starts after setup, through moto's `reset-auth`. Before
  it, `"assume"` obtains role credentials (standing in for an instance profile) — moto 5.2.4 crashes
  (500) if a user assumes a service-only role while enforcement is on, where AWS would refuse it.
  moto does NOT evaluate condition keys (`s3:prefix` was ignored), cross-account policies or SCPs:
  those claims stay doc-cited, and the frame says so. Mutate the policy and watch the replay fail
  before trusting an enforced step.
- moto places every Auto Scaling instance in the first AZ, reports instances `running` at once,
  ignores a template's metadata options on launch, records SSM commands without running them, and
  its CloudFormation change sets and failed updates are not faithful (no Replacement detail, no
  rollback). Frames show what is true (the group's sizes, the template, cfn-lint, the resource
  schemas) and say what the emulator skipped.
- A process a step starts in the background must have its output redirected (or the replay waits
  for it), and is stopped by its pid (`export SERVER=$!` … `kill $SERVER`) — `pkill -f` matches the
  replay's own shell. A typed line exactly the pane's width is refused as ambiguous.
- moto's `cloudformation deploy` (a change set) records no outputs or exports; `create-stack` does —
  use it where a later stack imports a value.
- moto ignores a CloudFormation bucket's versioning, lifecycle and bucket-key settings, and a
  CloudFormation KMS key's policy breaks `kms describe-key` (500). Course 8 therefore declares the
  buckets and key in `templates/storage.yaml` and applies each setting with its `s3api` call, from a
  JSON file under `infra/s3/`. Its version listing also mislabels "latest" after a delete.
- moto's RDS keeps what a template asks for (engine, class, Multi-AZ, encryption, subnet group,
  backups) but not deletion protection, the managed master secret, the port or the subnet group's
  AZs, and maps `VPCSecurityGroups` to the wrong group; it rejects `!GetAtt …Endpoint.Address` and
  `MasterUserSecret`. Course 9 shows only the faithful fields, and its step setup stores the
  `rds!db-shop-orders` secret RDS would create. Secrets Manager `VersionId`s are not seeded — never
  print one. DMS records endpoints and tasks and moves no data.
- moto creates Lambda functions and Step Functions state machines but runs neither without Docker:
  `tools/invoke_local.py` imports and calls the handler as the runtime would, and
  `tools/run_workflow.py` walks the ASL with stand-in task results — both say so on screen. AWS
  managed policies exist only with `"moto": {"MOTO_IAM_LOAD_MANAGED_POLICIES": "true"}`.
  API Gateway and Cognito are recorded, not enforced (401/400/429 are doc-cited).
- **A step whose `time` starts with `@` has a TICKING clock** (libfaketime starts there and runs).
  SQS shows a message again only when `now > visible_at`, so under the frozen clock a visibility
  timeout never ends; `decouple/04` and `/08` tick, and must print no timestamps.
- **`orders/03` runs real PostgreSQL 16**, not the emulator: start the local cluster first
  (`pg_ctlcluster 16 main start`, and once `su postgres -c 'createuser -s root'`).
- **Run one replay at a time** — every step takes port 5000.

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
| `replayed` | a spine file; its filename carries no level | the card's text must equal a file under `spine/**/project/` byte for byte, and gets its type's static check (`.sh` bash -n + CLI model, policy `.json` parliament, `.yaml` cfn-lint, `.asl.json`) — `check:spine` already ran it |

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

## The fixed example — the shop (frozen: frames quote these numbers)

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
| app servers | launch template `order-api` v14: m7g.large (Graviton, 2 vCPU, 8 GiB), instance profile OrderApi, IMDSv2 required, sg-app; release `order-api-1.4.2.tar.gz` in `shop-releases-111122223333`; logs `/shop/order-api` |
| scaling | ASG `order-api`, min 3 (one per AZ); scheduled action `evening-peak` 17:45 Europe/London → min 6; reactive-only model: 5 min short, worst 110 req/s (assumed 5 min to in service) |
| purchase month | baseline 3 × 24 h committed $60.48 + peak 3 × 6 h on-demand $21.60 + image worker 2 × 4 h Spot $3.84 = $85.92 (all on-demand $117.60) |
| container | ECR `order-api:1.4.2`; Fargate task 512 CPU / 1024 MiB ARM64; roles OrderApiExecution (pull, logs) + OrderApi (task); stopTimeout 30 s |
| statelessness | 300 carts, round robin over 3 servers: carts on local disk, scale-in of app-2 loses 100; shared store loses 0 |
| buckets | `shop-catalog-<acct>` (versioned: noncurrent expire 30 d; `exports/` → STANDARD_IA 30 d → GLACIER 90 d), `shop-uploads-111122223333` (review photos, presigned PUT 300 s, key `reviews/p-1001/photo-77.jpg`), `shop-reports-111122223333` (SSE-KMS `alias/shop-reports`, bucket key), `shop-releases-111122223333` |
| S3 race | p-1001.json `{price 12.0, stock 40}`; price job → 10.0, stock job → 39; plain PUT ends `{12.0, 39}`, If-Match ends `{10.0, 39}` (moto) |
| block / file | invoice service: 30 GiB gp3 in eu-west-2a → snapshot → restored in eu-west-2b (moto); EFS `shop-invoices-1` mounted at /mnt/invoices in all three AZs |
| orders DB | RDS PostgreSQL 16.9 `shop-orders`, db.r7g.large (cfn-lint: 16.4 deprecated, db.m7g.large not offered here), 100 GiB gp3, Multi-AZ (instance), encrypted, 7-day backups, deletion protection, password managed in Secrets Manager, subnet group `shop-data`, sg-db; max_connections 200 (assumed), 10 reserved, pool 20/server → 12 servers = 50 refused |
| order 501 | customer c-17; 2 × p-1001 (10.00, stock 40) + 2 × p-1002 (4.50, stock 1), total 29.00 → CHECK fails, rolled back (PostgreSQL 16) |
| access mix | product by id ~450 reads/s, place order ~6 writes/s, a customer's orders ~40 reads/s (evening peak, assumed) |
| DynamoDB | table `Orders` (PK customer, SK `<time>#<order>`, on demand; c-17 has o-501, o-511, o-514), GSI `by-status` (2 values → hot key); `Stock`/`Orders` transaction: o-601 placed, o-602 ConditionalCheckFailed (moto) |
| cache | p-1001 12.0 → 10.0 at t=10 s, TTL 60 s: stale 10–60 s; delete-on-write: fresh at 20 s |
| migration | DMS task `orders-to-rds`, full-load-and-cdc, schema `shop`; source `orders.dc.example.com`, replication instance `shop-dms` dms.t3.medium |
| API | REST API, model `Order` + validator `body-only`, Cognito authorizer `shoppers`, stage `prod` throttle 600 rps |
| functions | `place-order` (python3.13, arm64, 512 MB, timeout 10 s, role PlaceOrderFn, reserved concurrency 50; 0.12 s assumed → 67 needed at 560 req/s, 143/s throttled); also reserve-stock, charge-payment, ship-order, release-stock |
| lake | `s3://shop-lake-111122223333/order_history/`, Glue db `shop_lake`, table `order_history` (Parquet, partition dt; v2 adds `channel`; Analyst SELECT excluding `customer`); September 2026 history: 60,000 rows (2,000/day, seed 12, analytics/history.py); one day opens 546 KiB flat vs 27 KiB partitioned vs 433 KiB as 200 tiny files; 11–13 Sep sales 124,325.0 / 130,393.0 / 119,001.5, 3 days scan 81 KiB (DuckDB, labelled) |
| CDC 12 Oct | 6 records → 4 orders (o-502 replayed; o-503 insert 340.00 then update 352.50; o-504 at 23:58 arrived 00:04), naive 961.50, reconciled 756.50 = source |
| stream | Kinesis Data Streams `shop-clickstream`, provisioned, 2 shards, 24 h; 1,800 rec/s vs consumer 1,600/s (model) → iterator age 4 / 7 / 10 / 14 min at 18:30 / 19:00 / 19:30 / 20:00, 600/s after 20:00, caught up 20:24 |
| IaC | stack `shop-prod` v14 → v15 (v15 fails at 18:41, rolled back; its migration had already run); order-events template: waves topic+DLQ → queue → policy+subscription; replacement from schemas: RDS StorageEncrypted, SQS QueueName |
| release | order-api 1.5.0 fails 2%: failed requests before a 2-min alarm at 560 req/s — all at once 1,344, linear 10%/min 202, canary 10% 134; CodeDeploy `CodeDeployDefault.ECSLinear10PercentEvery1Minutes` |
| promotion | commit 9f3c2e1 → one image digest → dev, then prod; pipeline role `ShopPipeline` (dev 444455556666) is the only principal prod's `ShopDeploy` trusts |
| messaging | SQS `fulfilment` (visibility 30 s; o-503 crash → receive #2), DLQ `fulfilment-dlq` after 3 (o-999); SNS `order-events` → fulfilment, loyalty, fraud-check (total ≥ 500: o-505 640.00 yes, o-501 29.00 no); EventBridge bus `shop`, rules `uk-vat` (OrderPlaced, GB) → vat-ledger, `refunds` → refunds (o-501 GB, o-506 FR, o-488 refund); DynamoDB `idempotency` (key `ship#o-501`); workflow `place-order` (ChargePayment retry Payment.Timeout 2 s × 2.0 ×2, catch → ReleaseStock → OrderFailed; o-507 declined at 6 s) |
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
frame already quotes.

## Authoring conventions

- **Section shape:** objective → mental model → worked example → misconception or contrast →
  bridge. One idea per frame. Explain a term before relying on it. Following along is optional; no
  exercises, assessments or "your tasks". Never claim the learner has achieved competence.
- **Introduce access, logs, cost and failure boundaries with their first operation**, deepen later.
- **Label variants before claiming behaviour** (RDS Multi-AZ instance vs cluster vs Aurora; DynamoDB
  table/index, regional/global; Lambda sync/async/event-source mapping; which Kinesis service).
- **Narration is flowing prose, 90–180 s**, that walks the frame left to right and never reads code
  aloud character by character. Every fact on the frame gets its sentence. It ends with a one-line
  bridge to the next section.
- **Narration is written for the speech engine:** spell acronyms as letters — "A W S", "E C two",
  "S three", "I A M", "V P C", "A R N", "S D K", "C L I", "A P I", "D N S", "H T T P S", "M F A",
  "S T S", "R D S", "S Q S", "K M S", "J S O N"; "Route fifty three"; "E U west two"; account ids digit
  by digit in groups ("four four four four, five five five five, six six six six"); prices as words.
- **A claim that is not computed on screen** (a default, a quota, who patches what) carries its
  source URL as a `// source:` comment in the scene file.
- **Out of scope** (per the plan): advanced Kubernetes, landing-zone implementation, specialised
  networking, database internals, full data-engineering platforms, ML/AI, IoT, media, HPC; SQL, Python,
  Spark, system design and Databricks have their own courses.

## Scene inventory

| Scene id | Shape | Used by |
| --- | --- | --- |
| `one-server` | one-server request path + owning list beside the demand-day plot and two tables | `why-cloud-one-shop-one-server` |
| `elastic-day` | shopper → load balancer → 1/2/4 servers beside the elastic-capacity plot and the day's bill | `why-cloud-renting-instead-of-owning` |
| `managed-services` | own server → EC2 → RDS → Lambda → SQS, each "you run" over "AWS runs", above the trade | `why-cloud-managed-services` |
| `shared-responsibility` | IN the cloud (you) over OF the cloud (AWS) beside the who-patches matrix and incidents | `why-cloud-shared-responsibility` |
| `shop-on-aws` | map frame: the finished shop beside the course-as-route table | `why-cloud-what-we-will-build` |
| `region-boundaries` | eu-west-2's three AZs (c lost) above the boundaries list and two failure tables | `how-aws-runs-regions-and-availability-zones` |
| `service-scopes` | global / Regional / zonal tiles above the what-it-means table | `how-aws-runs-global-regional-and-zonal-services` |
| `api-everywhere` | console / CLI / SDK → endpoint → S3 beside the same call as CLI and boto3 | `how-aws-runs-every-action-is-an-api-call` |
| `request-anatomy` | map frame: replayed head-object + request_parts.py (`spine/how-aws-runs/04-anatomy`) | `how-aws-runs-anatomy-of-a-request` |
| `arn-anatomy` | the queue ARN's six fields beside the shop's ARNs table | `how-aws-runs-arns-and-resource-identity` |
| `what-keeps-charging` | the hypothetical meters table beside the dev account's month, running vs stopped | `how-aws-runs-what-keeps-charging` |
| `project-tour` | IDE: the finished tree, what-each-part-is-for table in the editor's place | `start-the-finished-project-toured` |
| `root-user` | the dev account's identities (root in red) beside root-only jobs and lock-it-away | `start-the-account-and-its-root-user` |
| `first-session` | map frame: real CLI, no SSO token (not emulated) + sso login steps + shape-checked identity | `start-a-first-session` |
| `emulator` | IDE: env.sh, emulated identity and empty account; shows / cannot show | `start-the-emulator-beside-aws` |
| `first-bucket` | map frame: infra/01-bucket.sh, its run, and BucketAlreadyOwnedByYou on the second run | `start-the-first-resource` |
| `cleanup` | IDE: tools/cost_ledger.py (36.21 / 7.01) then teardown; budget is not a cap | `start-billing-budgets-and-cleanup` |
| `principals` | map frame: principal kinds, Identity Center assignments, authn vs authz | `secure-principals-authentication-and-federation` |
| `org-structure` | map frame: the organization as a tree, what an account isolates | `secure-accounts-and-environments` |
| `role-trust` | IDE: order-api-trust.json, infra/04-roles.sh run; trust vs permissions | `secure-a-role-for-the-app` |
| `assume-role` | map frame: assume-role by hand (enforcement off, trust unchecked — said on screen) | `secure-assuming-the-role` |
| `policy-statements` | IDE: OrderApiAccess (3 statements) put and read back | `secure-policy-statements` |
| `denied` | IDE: + DenyDrafts; tools/probe.py under IAM enforcement (mutation-tested) | `secure-why-a-request-is-denied` |
| `cross-account` | IDE: reports bucket policy for the audit account's Auditor; both sides must allow | `secure-resource-policies-and-cross-account-access` |
| `guardrails` | IDE: StayInLondon SCP attached to Workloads in an emulated organization | `secure-guardrails-and-audit-ownership` |
| `cidr-plan` | IDE: tools/cidr_plan.py (local, not emulated); ports; CIDR rules | `network-addresses-cidr-and-ports` |
| `vpc-layout` | map frame: infra/05-network.sh (VPC + 9 subnets) and its run; tier placement | `network-a-vpc-across-three-azs` |
| `route-selection` | map frame: 05-routes.sh + tools/route_pick.py (reads the emulator's tables) | `network-route-tables` |
| `private-egress` | map frame: no route → 05-egress.sh (NAT in public-a) → via nat; who can start a connection | `network-going-out-from-a-private-subnet` |
| `traffic-filters` | map frame: 05-filters.sh sg chain; SG vs NACL | `network-security-groups-and-network-acls` |
| `dns-resolution` | map frame: shop-alias.json, 05-dns.sh; resolution steps; routing policies | `network-a-name-for-the-shop` |
| `tls-path` | map frame: hop-by-hop encryption, the HTTPS listener (doc-cited) | `network-tls-along-the-path` |
| `lb-health` | map frame: 05-lb.sh then tools/health_timeline.py (a model): out at 15 s, back at 85 s | `network-the-load-balancer` |
| `private-connectivity` | endpoints / peering / TGW / VPN / DX beside the comparison table | `network-private-paths-and-hybrid-links` |
| `order-api` | IDE: app/server.py run locally against the emulated bucket (200, 404, /health, log) | `run-the-order-api` |
| `compute-choice` | EC2 / Fargate / Lambda / EKS cards beside the comparison table | `run-choosing-compute` |
| `launch-template` | map frame: 06-template.sh, one instance through its lifecycle | `run-a-server-from-a-template` |
| `purchase-options` | IDE: tools/purchase_mix.py ($85.92 vs $117.60, local); m7g.large anatomy | `run-instance-types-and-paying-for-them` |
| `bootstrap-and-ssm` | IDE: app/user-data.sh, template v2, send-command (recorded, not run) | `run-bootstrap-and-systems-manager` |
| `scaling-timeline` | map frame: 06-scaling.sh, group sizes, evening-peak, tools/surge.py (model) | `run-auto-scaling` |
| `ecs-task` | IDE: app/task-definition.json registered; ECR repo; two roles | `run-containers` |
| `eks-choice` | illustrative Deployment manifest beside buys/costs and the verdict | `run-when-kubernetes-pays` |
| `stateless-design` | IDE: carts.py (100 lost) then the real app's SIGTERM handling | `run-stateless-and-graceful` |
| `scripts-twice` | map frame: 05-network.sh again → two shop-prod VPCs → InvalidGroup.Duplicate | `automate-when-the-scripts-stop-scaling` |
| `declarative-vs-imperative` | script excerpt over template excerpt beside the comparison and what a stack holds | `automate-declarative-infrastructure` |
| `first-stack` | IDE: templates/network.yaml, cfn-lint, deploy, deploy again (no changes) | `automate-a-first-stack` |
| `params-and-secrets` | IDE: templates/filters.yaml (param, ImportValue, GetAtt, Export), create-stack, exports | `automate-parameters-outputs-and-references` |
| `change-sets` | IDE: tools/replacement_preview.py (AWS resource schemas): /16 → /15 replaces 10 of 10 | `automate-change-sets-and-drift` |
| `rollback-and-protection` | IDE: templates/orders-db.yaml; cfn-lint W3011 on a half-protected copy; illustrative events | `automate-rollback-and-stateful-resources` |
| `deployment-strategies` | map frame: tools/traffic_shift.py (model): 1344 / 202 / 134 failed | `automate-releasing-the-app` |
| `promotion-and-tools` | map frame: build → dev → prod, ShopDeploy trust policy, CFN / CDK / Terraform | `automate-one-artefact-two-accounts` |
| `storage-kinds` | object / block / file lists above the choice table and what survives what | `files-object-block-and-file` |
| `catalog-bucket` | map frame: storage.yaml's HttpsOnly policy, the stack, put / get / list | `files-the-catalog-bucket` |
| `presigned-upload` | IDE: tools/presign_upload.py (real SigV4 URL, PUT with no credentials) | `files-uploads-without-credentials` |
| `concurrent-writers` | IDE: tools/two_writers.py: plain PUT {12.0, 39}, If-Match {10.0, 39} | `files-two-writers-one-key` |
| `version-timeline` | IDE: versioning + lifecycle, tools/versions.py (delete marker, restore) | `files-versions-and-lifecycle` |
| `ebs-snapshot` | map frame: 30 GiB gp3 in 2a → snapshot → volume in 2b; EFS; FSx table | `files-volumes-and-shared-files` |
| `data-protection` | IDE: storage.yaml's KMS key; SSE-KMS with a bucket key; threat × protection | `files-encryption-replication-and-backup` |
| `access-patterns` | access-pattern table → relational / key-value / in-memory lists → five questions | `orders-what-the-orders-need` |
| `rds-instance` | map frame: orders-db.yaml (+ sg-db), the stack, describe-db-instances; what "managed" covers | `orders-the-orders-database` |
| `order-transaction` | IDE: sql/place_order.sql in real PostgreSQL 16 (not emulated): CHECK fails → ROLLBACK | `orders-placing-an-order` |
| `db-connections` | IDE: tools/connections.py: secret from Secrets Manager, 12 servers × 20 → 50 refused | `orders-connections-and-credentials` |
| `rds-availability` | Multi-AZ instance / cluster / Aurora / replica / PITR table above three bad evenings | `orders-availability-read-scaling-and-restore` |
| `dynamodb-keys` | IDE: tools/orders_table.py: customer + time#order, by-status hot key | `orders-a-key-value-table` |
| `dynamodb-conditions` | IDE: tools/last_unit.py: TransactWriteItems, o-601 placed, o-602 cancelled; read consistency | `orders-the-last-unit-in-stock` |
| `cache-aside` | IDE: tools/cache_aside.py (plain Python): TTL-only stale 10–60 s vs delete-on-write | `orders-caching-the-product-page` |
| `migration-and-specialists` | IDE: infra/09-migration.sh (DMS full-load-and-cdc, recorded not run); specialist engines | `orders-migration-and-specialist-databases` |
| `api-contract` | map frame: infra/10-api.sh (Cognito authorizer, body-only validator, Order model, prod 600/1200); 401/400/429 | `decouple-an-api-in-front` |
| `lambda-handler` | IDE: functions/place_order/handler.py, created in moto, invoked locally twice (201, 409; one init) | `decouple-a-function-to-place-the-order` |
| `concurrency-limits` | IDE: policies/place-order-fn.json, reserved concurrency 50, tools/concurrency.py (67 / 417 / 143) | `decouple-concurrency-and-what-is-behind-it` |
| `queue-consumer` | IDE: tools/consumer.py: crash before delete, o-503 back on receive #2; standard vs FIFO | `decouple-a-queue-for-fulfilment` |
| `sns-fanout` | map frame: infra/10-fanout.sh, two publishes, fraud-check filter (total ≥ 500) | `decouple-fan-out` |
| `event-routing` | map frame: infra/10-events.sh, bus shop, uk-vat / refunds rules, three sample events | `decouple-event-routing` |
| `order-workflow` | IDE: workflows/place-order.asl.json; tools/run_workflow.py walks it with stand-in task results | `decouple-the-order-workflow` |
| `idempotency` | IDE: workers/ship_once.py: ship#o-501 once, o-999 to the DLQ after 3, jittered waits | `decouple-doing-it-once` |
| `integration-choices` | map frame: one order end to end, which mechanism, what asynchronous costs | `decouple-choosing-the-mechanism` |
| `state-vs-history` | DB → export/CDC → S3 lake → Glue → Athena row above state-vs-history table and why-not list | `report-state-against-history` |
| `cdc-reconcile` | IDE: lake/cdc/*.jsonl + analytics/reconcile.py: naive 961.50 vs reconciled 756.50 = source | `report-getting-the-data-out` |
| `lake-layout` | IDE: analytics/layout.py (real Parquet): one day opens 546 / 27 / 433 KiB | `report-the-lakes-layout` |
| `glue-catalog` | IDE: infra/11-catalog.sh, partitions, add_column.py (2 versions), Lake Formation grant without customer | `report-the-catalog-and-its-governance` |
| `athena-query` | IDE: sql/daily_sales.sql run by DuckDB locally (labelled) and submitted to Athena in moto | `report-querying-with-athena` |
| `stream-lag` | IDE: analytics/consumer_lag.py (model) + shop-clickstream's 2 shards and key → shard | `report-a-stream-of-clicks` |
| `warehouse-or-cluster` | Athena / Redshift / EMR lists above the which-engine table and a caution list | `report-warehouse-or-cluster` |

## Engine notes (written against flow 1.3.0 / shell 0.10 — recheck on 2.2.0 / 0.14)

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
- **Node ids are unique within a scene** — a map frame owns the bare part ids (`lb`, `app`, `db`, …),
  so a side pane must not reuse them (`check-render.mjs` catches it before the browser hangs).
- **`SiteHeader` goes on the catalog page only.**
- **Three stylesheets, in cascade order** in `main.tsx`: flow, shell, then `./theme.css` last.
- **`file:../ui-flow` / `file:../ui-shell` must never be committed.**
- **Narration is never hand-produced.** `.tts` → `.wav` via Colab + Chatterbox only
  (`npm run gen:audio` writes `scripts/audio-manifest.json` for that pass).

## Guards — run all before handing over

```sh
npx tsc --noEmit && npm run build && npm run check && npm run check:aws
node scripts/snap.mjs <outDir> [slug-prefix …]   # 1920×1080 captures to look at
```

`check` = scene-only content + icon names + plan conformance + `check-render.mjs` (every section at
3840×2160: text leaving its node, clipped content, IDE panes and the map that move). All of these are
a **floor, not proof** — look at the rendered route.

## Working agreement

- **Author the whole unit, then hand over the route.** Scenes, spine steps and narration together.
- **No ASCII sketches of scenes.**
- **No silent scaffolding**, no work outside the ask. Say plainly what was built, what was verified,
  and what was left out.
