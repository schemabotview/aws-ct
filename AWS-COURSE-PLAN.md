# AWS — From Cloud Foundations to Advanced Architecture and Operations

## Audience and prerequisites

For learners new to AWS who understand basic files, processes, and applications. Introduce IP addressing, HTTP, DNS, identities, and cloud vocabulary where needed. Reading simple Python, SQL, and JSON/YAML is helpful; explain the syntax used in illustrations. Advanced programming, Kubernetes, and distributed-systems expertise are not prerequisites.

Scope: the lifecycle of a representative AWS application, from safe access and infrastructure choices through data, integration, delivery, operations, and architectural evolution. This is a general AWS course, independent of certification tracks. Explain application through annotated commands, policies, code, queries, templates, diagrams, calculations, and failure traces. No AWS account, paid deployment, submitted exercises, or learner monitoring is required; following examples is optional.

Reference surface: official AWS documentation researched on **2026-10-12**. AWS has no single platform version. Identify the Region, service variant, runtime, feature eligibility, and relevant quota when authoring detailed examples. Prices and defaults require fresh checks; use clearly stated assumptions for cost calculations. Core teaching does not depend on preview features.

Target: understand how to construct and explain representative AWS workloads, trace requests and data across service boundaries, and justify security, reliability, performance, delivery, and cost decisions. The course supports advanced reasoning without claiming assessed production competence.

Structure: **12 chapters**, with **6, 7, 9, 8, 7, 8, 9, 7, 7, 10, 6, and 5 sections**. Counts follow conceptual scope rather than quotas or equal teaching duration.

## Learning spine

Understand the cloud and establish safe access → trace requests → select compute and persistent data → connect asynchronous work and analytics → reproduce deployments → observe and recover → optimise and justify the whole architecture.

Recurring example: an online ordering application serves product information, accepts orders, records transactions, sends fulfilment notifications, and produces business summaries. Begin with a small request-to-response sketch, then evolve it as access, traffic, data, and recovery requirements become clearer. VM, container, and serverless implementations are alternatives compared under explicit assumptions. The example does not accumulate every service into one design.

Teaching method: objective → mental model → annotated example and expected behaviour → alternative or failure contrast → explanation summary → bridge. Introduce access controls, logs, cost awareness, and failure boundaries with their first relevant operation, then deepen them later. Use the AWS Well-Architected pillars as recurring questions about decisions, not as a service checklist.

## Chapter 1 — Cloud Foundations and a Safe First Workload

Objective: Explain the cloud operating model and trace a small workload without losing sight of access, responsibility, and cost.

1. On-demand resources, managed services, elasticity, and the cloud operating model
2. Shared responsibility: infrastructure, configuration, application, and data ownership
3. Regions, Availability Zones, global services, and failure boundaries
4. Accounts, root-user protection, MFA, and a first federated or temporary session
5. Console, CLI, SDK, APIs, ARNs, and an annotated request-to-response walkthrough
6. Billing awareness, budgets, resource tags, and cleanup responsibilities

Worked illustrations: A product-page request diagram; an annotated CLI/API call showing identity, Region, resource, and response; a responsibility matrix; a resource-cost ledger with explicit assumptions. Explain why a budget alert is not a universal spending cap and why stopping compute may leave other billable resources.

Outcome: Explain where a workload runs, who is responsible for its components, and how an API request and resource lifecycle relate to access and charges.

Bridge: A safe first session is only a starting point; next we make identities, permissions, and account boundaries explicit.

## Chapter 2 — Identity, Permissions, and Account Governance

Objective: Explain how AWS authorises requests and how account boundaries support delegated ownership.

1. Principals, authentication, federation, and IAM Identity Center
2. IAM roles, trust policies, STS, and temporary workload credentials
3. Policy statements: actions, resources, effects, and conditions
4. Policy evaluation: implicit deny, explicit deny, and effective permission boundaries
5. Resource policies, cross-account access, and service-to-service authorisation
6. Accounts, organisational units, AWS Organizations, and environment isolation
7. Guardrails, SCP/RCP boundaries, delegated administration, and audit ownership

Worked illustrations: Annotated IAM JSON and a permission matrix; an application assuming a role; a denied S3 request with the relevant policy context; a development/production account diagram. Distinguish a role's trust policy from its permissions, and permission-granting policies from guardrails. Explain same-account and cross-account cases separately rather than treating all policy evaluation as one intersection formula.

Outcome: Interpret a scoped policy, explain a role-assumption path, and reason about why a request is permitted or denied under stated account and policy assumptions.

Bridge: Authorisation does not establish network reachability; next we trace the paths requests must travel.

## Chapter 3 — Networking and the Request Path

Objective: Explain the network path from a client to an application and its private dependencies.

1. IP addresses, CIDR ranges, ports, protocols, and subnet foundations
2. VPCs, Availability Zone placement, network interfaces, and subnet layout
3. Route tables, local routing, internet gateways, and route selection
4. Public and private connectivity: addressing, NAT, and outbound dependencies
5. Security groups and network ACLs: state, rule scope, and traffic filtering
6. DNS resolution and routing choices with Route 53
7. TLS, certificates, termination points, and encryption along the path
8. Load balancers, target groups, health checks, and traffic distribution
9. VPC endpoints, peering/transit choices, VPN, and Direct Connect boundaries

Worked illustrations: A browser → DNS → load balancer → application → database diagram; a small CIDR calculation; annotated routes and security-group rules; a private application that cannot reach an external API. Contrast reachability, authentication, and authorisation. Explain why a public subnet alone does not make every resource internet-accessible, and why network connectivity does not imply encryption.

Outcome: Trace a request and its return path, interpret basic routing and filtering decisions, and identify a plausible cause of a connectivity failure.

Bridge: With request paths established, next we choose where application processing runs and how capacity changes.

## Chapter 4 — Compute and Elastic Application Capacity

Objective: Compare compute models and explain the lifecycle of replaceable application capacity.

1. Compute selection by workload shape, control, operational effort, and latency
2. EC2 instances, AMIs, launch templates, and lifecycle transitions
3. CPU, memory, architecture, instance families, and purchase-model trade-offs
4. Bootstrap, configuration, Systems Manager access, and patch responsibilities
5. Auto Scaling, health replacement, scaling signals, and capacity delays
6. Images and registries with ECR; tasks and services with ECS/Fargate
7. EKS and Kubernetes: when orchestration requirements justify added complexity
8. Stateless application design, graceful shutdown, and failure replacement

Worked illustrations: An annotated launch configuration and container task definition; a traffic/capacity timeline; an interrupted worker and replacement instance; an application storing sessions on local disk. Compare VM and container choices for the same order API. Introduce logs and least-privilege workload roles immediately; explain Spot interruption and scaling delay without assuming unlimited capacity.

Outcome: Explain a VM or container deployment, select a provisional compute model, and reason about scaling and replacement without confusing process recovery with business correctness.

Bridge: Replaceable compute needs deliberate storage choices; next we separate transient execution state from persistent data.

## Chapter 5 — Storage and the Data Lifecycle

Objective: Choose storage according to access semantics, durability requirements, recovery needs, and cost.

1. Object, block, and file storage: interfaces, workloads, and persistence boundaries
2. S3 buckets, object keys, requests, policies, and controlled upload/download paths
3. S3 consistency, concurrent updates, and the boundary of single-object operations
4. Versioning, lifecycle rules, storage classes, and retrieval implications
5. EBS volumes, attachment/lifecycle decisions, snapshots, and recovery
6. Shared file access with EFS and workload-driven FSx selection
7. Encryption, key access, retention, replication, and backup trade-offs

Worked illustrations: An annotated S3 upload and presigned-access sequence; two writers replacing the same key; a version/delete-marker timeline; a detached volume and snapshot restore; a storage-choice table. Use general-purpose S3 buckets for the core example and label variant-specific behaviour. Explain strong object consistency without implying multi-object transactions, and distinguish replication, version history, retention protection, and recoverable backups.

Outcome: Justify an object/block/file choice, explain its access and lifecycle assumptions, and identify what evidence is needed to claim recoverability.

Bridge: Storage preserves bytes; next we examine database services that organise application state and coordinate changes.

## Chapter 6 — Databases and Application Access Patterns

Objective: Match application requirements to database choices and explain their correctness and availability boundaries.

1. Data models, access patterns, transactions, latency, and growth requirements
2. RDS and Aurora: managed relational responsibilities and engine selection
3. Transactions, connection management, credentials, and application failure handling
4. Availability, read scaling, backups, and restore: distinct database capabilities
5. DynamoDB partition/sort keys, indexes, capacity, and hot access patterns
6. Conditional writes, transactions, and read-consistency choices in DynamoDB
7. ElastiCache, cache-aside flows, expiry, invalidation, and stale reads
8. Migration with DMS and specialist database selection boundaries

Worked illustrations: SQL for placing an order; a connection-exhaustion trace; an RDS failover versus read-replica comparison; DynamoDB item/key sketches and a conditional update; a stale-cache timeline. Separate RDS Multi-AZ DB-instance deployments, Multi-AZ DB clusters, Aurora, and read replicas rather than generalising standby or reader behaviour. Specify DynamoDB table/index and regional/global-table variants before claiming consistency guarantees.

Outcome: Compare relational, key-value, and cached designs, explain a data-access sequence, and identify the difference between transaction correctness, availability, read scaling, and recovery.

Bridge: Durable application state now supports workflows that cross service boundaries; next we connect requests, events, and background work.

## Chapter 7 — APIs, Serverless Execution, and Asynchronous Work

Objective: Explain synchronous and asynchronous workflows, including retries, concurrency, and duplicate effects.

1. API Gateway, request contracts, authentication, validation, and throttling
2. Lambda handlers, execution environments, initialisation, reuse, and timeouts
3. Execution roles, configuration, concurrency controls, and downstream capacity
4. SQS queues: polling, visibility, acknowledgement, and standard/FIFO choices
5. SNS topics, subscriptions, filtering, and fan-out delivery
6. EventBridge buses, rules, schemas, and event routing
7. Step Functions: workflow state, branching, retries, and compensation
8. Idempotency, backoff, dead-letter handling, replay, and partial failures
9. Choosing synchronous APIs, queues, events, and orchestration together

Worked illustrations: An annotated Python handler and API response; a queue-consumer sequence; a duplicate fulfilment message; a timeout after a successful database write; an order-workflow diagram. Distinguish Lambda synchronous, asynchronous, and event-source-mapping retry ownership. Scope execution examples to standard on-demand functions; explain that local environment reuse is not durable state. Separate message deduplication from end-to-end business-effect idempotency, including FIFO cases.

Outcome: Explain an API/event workflow, interpret retry and acknowledgement paths, and justify where idempotency, backpressure, and recovery handling belong.

Bridge: Operational events also support analytical views; next we follow data into systems designed for broader queries.

## Chapter 8 — Data Movement and Analytical Workloads

Objective: Explain a bounded analytical pipeline and select processing services from consumer requirements.

1. Operational versus analytical data: freshness, history, and query shape
2. Batch ingestion, CDC, transfer, and reconciliation choices
3. S3 lake layout, columnar formats, partitioning, and small-file implications
4. Glue Data Catalog, transformation jobs, schema changes, and access governance
5. Athena query execution, SQL results, scanned data, and cost implications
6. Kinesis streaming choices, ordering scope, retention, and consumer lag
7. Redshift and EMR: warehouse and distributed-processing selection

Worked illustrations: Order changes → S3 → catalog → Athena diagram; an annotated aggregation query and expected rows; partition-pruning comparison; late and duplicate records; a streaming consumer falling behind. State which Kinesis service is used in each example. Contrast current operational state with historical analytical records, and distinguish catalog metadata from permission enforcement and data quality.

Outcome: Explain how operational records become queryable analytical data, select a provisional processing approach, and recognise freshness, reconciliation, layout, and governance trade-offs.

Bridge: The application and data paths are understandable; next we make their infrastructure and releases reproducible.

## Chapter 9 — Repeatable Infrastructure and Delivery

Objective: Explain infrastructure changes and software releases as controlled, reviewable transitions.

1. Declarative infrastructure, resource ownership, dependencies, and repeatability
2. CloudFormation templates, stacks, resource references, and dependency ordering
3. Parameters, outputs, configuration, and secret-reference boundaries
4. Change sets, replacement implications, drift, and review limitations
5. Rollback, deletion/update policies, and protection of stateful resources
6. CI/CD artefacts, deployment identities, and rolling/blue-green/canary strategies
7. Environment promotion, provenance, and CloudFormation/CDK/Terraform boundaries

Worked illustrations: An annotated YAML template; a change set proposing resource replacement; a failed stack update; a deployment traffic-shift diagram; development-to-production promotion with separate roles. Explain why a change set cannot guarantee update success, why rollback cannot universally undo data changes, and why secret values must not be embedded in templates or build logs. Introduce CDK and Terraform as alternative authoring/tool choices without teaching additional complete tool courses.

Outcome: Interpret infrastructure and release artefacts, explain the impact of a proposed change, and identify state, identity, and rollback assumptions requiring review.

Bridge: Reproducibility supports operations but does not establish health; next we connect telemetry, incident response, and recovery evidence.

## Chapter 10 — Production Visibility, Security, and Recovery

Objective: Explain how to detect, investigate, contain, and recover from operational failures.

1. Metrics, structured logs, traces, correlation, and telemetry retention
2. Service objectives, alarms, dashboards, and actionable signals
3. CloudWatch versus CloudTrail: runtime evidence, API activity, and coverage choices
4. Operational access, Systems Manager, patching, and configuration inventory
5. KMS key policies, application encryption, secrets, and rotation dependencies
6. WAF, Shield, GuardDuty, Security Hub, and layered exposure/detection choices
7. Incident triage, containment, ownership, and runbook reasoning
8. Backup policies, isolated recovery copies, and restore validation
9. RTO/RPO, dependency recovery, failover/failback, and regional disaster recovery
10. Service quotas, throttling, dependency failures, and resilience validation

Worked illustrations: A latency incident correlated across metrics/logs/traces; an API audit event with its collection assumptions; a secret rotation that breaks a connection; a compromised-role containment sequence; a restore timeline with measured recovery checkpoints. Distinguish detection from prevention and an alarm from an automatic remedy. Explain why high availability and replication alone do not prove recovery from deletion, corruption, or a regional incident; identify adjustable versus fixed quotas rather than assuming every limit can be raised.

Outcome: Interpret operational evidence, explain a plausible incident/recovery sequence, and assess whether a design's observability, security, and recovery claims are supported by its configured controls and validation evidence.

Bridge: Once behaviour can be observed and recovered, next we use measurements to improve latency, resource use, and cost.

## Chapter 11 — Performance, Cost, and Sustainability

Objective: Evaluate optimisation choices against workload evidence and explicit economic assumptions.

1. Workload measurement, bottlenecks, throughput, latency distributions, and saturation
2. CloudFront and caching: edge delivery, origins, access controls, and freshness
3. Rightsizing, concurrency, scaling efficiency, and idle capacity
4. Cost allocation, tags, Cost Explorer, budgets, and anomaly investigation
5. Transfer, requests, storage, commitments, and total-cost trade-offs
6. Sustainability: utilisation, data movement, retention, and operational constraints

Worked illustrations: A latency breakdown before/after edge caching; cache-key and invalidation contrasts; a resource-utilisation graph; a monthly cost calculation using labelled hypothetical rates and workload assumptions. Include cross-AZ/Region and internet transfer where applicable, NAT processing, logs, backups, and idle resources. Compare on-demand capacity, commitments, and interruptible capacity without treating advertised discounts as guaranteed savings. Explain sustainability decisions with explicit constraints rather than assuming lower price always proves lower environmental impact.

Outcome: Identify a measured bottleneck or cost driver, construct an assumption-based comparison, and explain the correctness, reliability, and operational consequences of an optimisation.

Bridge: Individual optimisations must fit the whole workload; next we integrate requirements and evidence into architectural decisions.

## Chapter 12 — Architecture Evolution and Justified Decisions

Objective: Explain a complete AWS architecture and its evolution under changing requirements.

1. Requirements, constraints, alternatives, and architecture decision records
2. VM, container, and serverless order-platform comparisons
3. Single-Region, multi-AZ, and multi-Region choices and data consequences
4. Migration, staged adoption, cutover, coexistence, and rollback boundaries
5. Integrated Well-Architected review and priorities for improvement

Worked illustrations: Three alternative order-platform diagrams; a decision record connecting requirements to rejected/selected options; a regional-failure case; a staged migration with reconciliation and rollback limits. Review operational excellence, security, reliability, performance efficiency, cost optimisation, and sustainability together. Explain why extra services or Regions can introduce failure modes, and prioritise changes using evidence rather than a universal reference architecture.

Outcome: Present and critique a coherent AWS design, trace its requests and data, and justify trade-offs and evolution steps under stated requirements.

Bridge: Continue through optional implementation and operational practice, current service documentation, architecture reviews, and specialist study. Real production responsibility requires demonstrated deployment, security, incident, and recovery competence beyond following the course's worked explanations.

## Sources and scope

Official sources inspected for coverage and selected conceptual behaviours on 2026-10-12:

- [Overview of AWS](https://docs.aws.amazon.com/whitepapers/latest/aws-overview/introduction.html), including its compute, security, integration, analytics, and management categories; [Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html) and [pillars](https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html).
- [IAM introduction](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html), [policy evaluation](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html), [Organizations](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_introduction.html), [VPC introduction](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html), and [security groups](https://docs.aws.amazon.com/vpc/latest/userguide/vpc-security-groups.html).
- AWS decision guides for [storage](https://docs.aws.amazon.com/decision-guides/latest/decision-guides/choosing-aws-storage-service.html) and [databases](https://docs.aws.amazon.com/decision-guides/latest/decision-guides/databases-on-aws-how-to-choose.html); [S3 concepts and consistency](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html); [DynamoDB read consistency](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.ReadConsistency.html); RDS [Multi-AZ](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html) and [read replicas](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_ReadRepl.html).
- Lambda [execution lifecycle](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html) and [retry behaviour](https://docs.aws.amazon.com/lambda/latest/dg/invocation-retries.html); [SQS standard-queue delivery](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues-at-least-once-delivery.html).
- [CloudFormation introduction](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html) and [change sets](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-changesets.html); [Service Quotas](https://docs.aws.amazon.com/servicequotas/latest/userguide/intro.html); [disaster-recovery guidance](https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/plan-for-disaster-recovery-dr.html); [Billing and Cost Management](https://docs.aws.amazon.com/cost-management/latest/userguide/what-is-costmanagement.html).

Book comparison: Andreas and Michael Wittig's [Amazon Web Services in Action, third edition](https://www.manning.com/books/amazon-web-services-in-action-third-edition), March 2023, was inspected through publisher description and topic coverage. John Culkin and Mike Zazon's [AWS Cookbook](https://www.oreilly.com/library/view/aws-cookbook/9781492092599/) was inspected through publisher material and exposed contents. These inform coverage and practical-example choices; full texts were not accessed. Current primary documentation governs technical claims. Detailed research tracking and the coverage map are in [README.md](../README.md).

Boundaries: representative service selection and application/platform reasoning, not an exhaustive AWS catalogue. Advanced Kubernetes administration, enterprise landing-zone implementation, specialised networking, deep database internals, full data-engineering platforms, ML/AI, IoT, media, and HPC are deferred. Introduce relevant selection boundaries without promising specialist competence. SQL, Python, Spark, system design, and Databricks have separate plans; explain local prerequisites without reproducing those courses.

This document plans teaching material; it does not contain the completed lessons or executed deployments. Detailed code, policies, limits, recovery guarantees, regional availability, and cost examples require verification against their exact service configuration when lessons are authored.
