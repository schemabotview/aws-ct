import type { Section } from '../types'

export const eksAndKubernetes: Section = {
  id: 'eks-and-kubernetes',
  title: 'EKS and Kubernetes: when orchestration requirements justify added complexity',
  scene: 'eks-choice',
  focus: 'tradeoff',
  slide: `## EKS: when Kubernetes pays off

**Objective:** decide whether orchestration earns its cost.

### Mental model
- **Kubernetes** schedules containers from declared manifests
- **EKS** runs its control plane; you still own nodes, add-ons, upgrades
- A cluster fee every hour; a version upgrade about yearly

### Worked example: the shop today
- One service, one team, weekly deploys
- ECS already gives tasks, services, scaling, roles
- **Verdict:** ECS now; revisit as services multiply

### Misconception
- "Kubernetes is the grown-up default" — it is a platform to operate

### Explanation summary
- Adopt orchestration for needs you have, not ones you might`,
  narration:
    "Kubernetes is the most widely used container orchestrator, and E K S is A W S's managed Kubernetes. You declare what should run in manifests, like the deployment on the board, six replicas of the order A P I image on port eight zero eight zero, and Kubernetes keeps reality matching that declaration. E K S runs the control plane for you, but the cluster is still a platform you operate. There is a charge for every cluster hour, ten cents an hour on standard support and sixty cents once a version falls into extended support. Each Kubernetes version has about fourteen months of standard support, so upgrades are a recurring job. And nodes, networking add ons and the people who understand all of it are yours. The table sets out when that cost is worth paying: many services and many teams sharing one platform; an organisation already invested in Kubernetes tools; a need to run the same platform across clouds; or scheduling requirements that simpler services cannot express. Now the shop. It has one service, owned by one team, deploying weekly. E C S already gives it tasks, services, scaling, load balancer integration and per task roles. So the verdict is E C S for now, and to revisit the question when services and teams multiply. The misconception is that Kubernetes is the grown up default. It is a powerful platform, and a platform has to be operated. So adopt orchestration for requirements you have today, not for ones you might have one day.",
}
