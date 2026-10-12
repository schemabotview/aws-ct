import type { Course } from '../types'
import { computeSelection } from './01-compute-selection'
import { ec2AndLaunchTemplates } from './02-ec2-and-launch-templates'
import { instanceTypesAndPurchasing } from './03-instance-types-and-purchasing'
import { bootstrapAndSystemsManager } from './04-bootstrap-and-systems-manager'
import { autoScaling } from './05-auto-scaling'
import { containersEcrEcs } from './06-containers-ecr-ecs'
import { eksAndKubernetes } from './07-eks-and-kubernetes'
import { statelessAndGracefulShutdown } from './08-stateless-and-graceful-shutdown'

// Chapter 4 of AWS-COURSE-PLAN.md — 8 of 8 sections, one scene each.
//
// Objective: Compare compute models and explain the lifecycle of replaceable application capacity.
//
// Worked illustrations (from the plan): an annotated launch configuration and container task definition
// (§2 `launch-template`, §6 `ecs-task`, both validated request bodies); a traffic/capacity timeline
// (§5 `scaling-timeline`, run); an interrupted worker and replacement instance (§8 `stateless-design`,
// SIGTERM run); an application storing sessions on local disk (§8, run). VM vs container for the same
// order API: §6's table. Logs and least-privilege roles appear with the first server (§2, §4, §6); Spot
// interruption (§3, §8) and scaling delay (§5) without assuming unlimited capacity.
//
// Outcome: Explain a VM or container deployment, select a provisional compute model, and reason about
// scaling and replacement without confusing process recovery with business correctness.
//
// Bridge: Replaceable compute needs deliberate storage choices; next we separate transient execution
// state from persistent data. (Spoken as the last line of §8's narration.)
export const compute: Course = {
  id: 'compute',
  title: 'Compute and Elastic Application Capacity',
  sections: [
    computeSelection,
    ec2AndLaunchTemplates,
    instanceTypesAndPurchasing,
    bootstrapAndSystemsManager,
    autoScaling,
    containersEcrEcs,
    eksAndKubernetes,
    statelessAndGracefulShutdown,
  ],
}
