import type { Section } from '../types'

export const platformComparison: Section = {
  id: 'platform-comparison',
  title: 'VM, container, and serverless order-platform comparisons',
  scene: 'platform-alternatives',
  focus: 'paths',
  slide: `## VMs, containers, serverless

**Objective:** compare platforms by what they move to AWS.

### Mental model
- Each platform is a **request path**, DNS to data
- Moving work to AWS also moves **control** to AWS
- Each brings its own **limits and failure modes**

### Worked example: one order API, three ways
- VMs: Route 53 → ALB → EC2 Auto Scaling → RDS
- Containers: Route 53 → ALB → ECS Fargate → RDS
- Serverless: Route 53 → API GW → Lambda → DynamoDB
- Idle cost: server-hours, task-hours, or none

### Misconception
- "Serverless means no ops" — limits, retries, cost per call

### Explanation summary
- Pick the platform whose limits your workload fits`,
  narration:
    "Here are the three alternatives as diagrams, each a request path from D N S to data. With virtual machines: Route fifty three, the application load balancer, an E C two Auto Scaling group growing from three servers to six, and R D S PostgreSQL. With containers: the same front door and database, but the app runs as E C S tasks on Fargate, with no hosts for the team to see. Serverless: Route fifty three, A P I Gateway's prod stage, the place-order Lambda function, and a DynamoDB orders table. The table compares what each moves to A W S. On virtual machines the team runs the operating system, the runtime and the app; with containers, the image and the app; with functions, only the code. They scale by servers, by tasks, or by concurrent requests. Idle time costs every server hour, every task hour, or nothing. And each brings new limits: patch windows for servers; image pulls and network interfaces for tasks; for functions, the nine hundred second timeout and the concurrency quota from the operations chapter. Moving work to A W S also moves control: you can no longer tune the host, log in to it, or choose when it is patched. The misconception is that serverless means no operations. The timeouts, retries, quotas and cost per call still need designing and watching. So: pick the platform whose limits your workload fits, and not the one with the fewest boxes.",
}
