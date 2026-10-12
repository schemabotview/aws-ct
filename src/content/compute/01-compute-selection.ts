import type { Section } from '../types'

export const computeSelection: Section = {
  id: 'compute-selection',
  title: 'Compute selection by workload shape, control, operational effort, and latency',
  scene: 'compute-choice',
  focus: 'compare',
  slide: `## Choosing where code runs

**Objective:** pick a compute model from the workload's shape.

### Mental model
- **EC2**: you run the OS — most control, most work
- **Fargate**: you run containers; AWS runs the hosts
- **Lambda**: you run functions; 15-minute limit per call
- **EKS**: Kubernetes, at a cluster cost

### Worked example: the order API
- Steady HTTP, **560 req/s** at peak, DB connections held open
- One service, one team, weekly deploys
- Provisional pick: **containers on Fargate**

### Misconception
- "Serverless is always cheaper" — steady load can cost more per request

### Explanation summary
- Shape, control and effort decide; write the choice down`,
  narration:
    "Our order A P I has to run somewhere, and A W S offers several homes for the same code. On E C two, we run the whole operating system: the most control, and the most work, because the patching is ours. On E C S with Fargate, we hand over a container image and A W S runs the hosts underneath it. On Lambda, we hand over a function; A W S runs everything else, and each invocation can last at most fifteen minutes. And on E K S, we run Kubernetes, which brings its own ecosystem and its own cost for every cluster hour. The table compares them on what you patch, the unit you scale, how you are billed, the longest a single run can last, and how long a new unit takes to start. None of these is best in general. The workload's shape decides. The order A P I serves steady H T T P traffic all day, up to five hundred and sixty requests a second at the evening peak, and it holds connections open to its PostgreSQL database. It is one service, owned by one team, deployed weekly. That points to containers on Fargate as a provisional choice: no operating system to patch, steady capacity, and connections that stay open. We will build both the virtual machine and the container version in this chapter so we can compare them honestly. The misconception is that serverless is always cheaper. Per request billing is excellent for spiky or idle workloads; for steady, heavy traffic it can cost more than capacity you keep busy. So let shape, control and effort decide, and write the choice down with its reasons.",
}
