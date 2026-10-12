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
| 2 | `identity` | Identity, Permissions, and Account Governance | 7 | — |
| 3 | `networking` | Networking and the Request Path | 9 | — |
| 4 | `compute` | Compute and Elastic Application Capacity | 8 | — |
| 5 | `storage` | Storage and the Data Lifecycle | 7 | — |
| 6 | `databases` | Databases and Application Access Patterns | 8 | — |
| 7 | `integration` | APIs, Serverless Execution, and Asynchronous Work | 9 | — |
| 8 | `analytics` | Data Movement and Analytical Workloads | 7 | — |
| 9 | `delivery` | Repeatable Infrastructure and Delivery | 7 | — |
| 10 | `operations` | Production Visibility, Security, and Recovery | 10 | — |
| 11 | `optimisation` | Performance, Cost, and Sustainability | 6 | — |
| 12 | `architecture` | Architecture Evolution and Justified Decisions | 5 | — |

Each course's `index.ts` carries the plan's objective, worked illustrations, outcome and bridge as a
comment; the bridge is also the last words of the chapter's final narration.

## Verification levels — read before trusting a code card

There is no AWS account behind this course, so the SQL/Spark rule "every result was produced by a
real run" cannot hold. Instead **every code card declares how it was verified**, as the last part of
its `filename` after ` · `, and `npm run check:aws` (`scripts/check-aws.py`) proves the claim:

| level | what it means | what check:aws does |
| --- | --- | --- |
| `runs locally` | real Python, really run | runs the `.py` card; a sibling node `<id>-out` must equal its stdout exactly |
| `model-checked` | checked against the AWS service models (botocore, the source the CLI/SDKs are generated from) | `.sh`: service, operation and every `--param` exist; `<service>.<Operation>.json`: every top-level key is in that response shape; policy `.json`: Effect/Action present; `.yaml`: cfn-lint |
| `emulated` | behaviour from moto's emulator, **not AWS** | runs the `.py` card like `runs locally` |
| `doc-cited` | AWS documentation says so | the scene file must carry a `// source: https://…` comment |
| `illustrative` | made-up but realistic; nothing checks it | counted, so unverified cards stay visible |

Rules: a response card shows values that are **invented but shape-checked** (ETags, timestamps, role
suffixes) — never present them as captured output. CLI customisations (`aws sso login`,
`aws configure`, high-level `aws s3 …`) have no API operation and are reported as unchecked. When a
claim is not on a card (a quota, a default, a timing), put its source URL in the scene's comment.
Install the checker's deps with `pip install -r scripts/requirements-check.txt`.

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
| rate card | **hypothetical**, USD: instance $0.04/h, block volume $0.08/GB-month, public IPv4/Elastic IP $0.005/h, snapshot $0.05/GB-month, object storage $0.023/GB-month, 730 h/month. Always labelled hypothetical on screen |
| dev ledger | running $36.21/month, instance stopped $7.01 |

Public IPs in examples come from `203.0.113.0/24` / `198.51.100.0/24` (documentation ranges); private
addressing will be fixed in Chapter 3 and added here. Extend this table — never change a value a
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
