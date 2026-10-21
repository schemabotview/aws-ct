import type { Course } from '../types'
import { theOrderApi } from './01-the-order-api'
import { choosingCompute } from './02-choosing-compute'
import { aServerFromATemplate } from './03-a-server-from-a-template'
import { instanceTypesAndPayingForThem } from './04-instance-types-and-paying-for-them'
import { bootstrapAndSystemsManager } from './05-bootstrap-and-systems-manager'
import { autoScaling } from './06-auto-scaling'
import { containers } from './07-containers'
import { whenKubernetesPays } from './08-when-kubernetes-pays'
import { statelessAndGraceful } from './09-stateless-and-graceful'

// Course 6 — Run the app. The order API itself, the compute choice, a launch template and the
// instance lifecycle, purchase options, bootstrap and SSM, the Auto Scaling group with its evening
// schedule, a Fargate task definition, EKS weighed, and stateless, graceful servers.
export const run: Course = {
  id: 'run',
  title: 'Run the app',
  sections: [theOrderApi, choosingCompute, aServerFromATemplate, instanceTypesAndPayingForThem, bootstrapAndSystemsManager, autoScaling, containers, whenKubernetesPays, statelessAndGraceful],
}
