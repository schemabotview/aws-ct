import type { Course } from '../types'
import { declarativeInfrastructure } from './01-declarative-infrastructure'
import { cloudformationStacks } from './02-cloudformation-stacks'
import { parametersOutputsSecrets } from './03-parameters-outputs-secrets'
import { changeSetsAndDrift } from './04-change-sets-and-drift'
import { rollbackAndStatefulResources } from './05-rollback-and-stateful-resources'
import { cicdAndDeploymentStrategies } from './06-cicd-and-deployment-strategies'
import { promotionAndProvenance } from './07-promotion-and-provenance'

// Chapter 9 of AWS-COURSE-PLAN.md — 7 of 7 sections, one scene each.
//
// Objective: Explain infrastructure changes and software releases as controlled, reviewable transitions.
//
// Worked illustrations (from the plan): an annotated YAML template (§2, cfn-lint clean); a change set
// proposing resource replacement (§4, predicted from AWS's resource provider schemas); a failed stack
// update (§5, illustrative events); a deployment traffic-shift diagram (§6, with computed failures);
// development-to-production promotion with separate roles (§7). Why a change set cannot guarantee
// success (§4), why rollback cannot undo data changes (§5), why secrets must not be in templates or
// logs (§3, cfn-lint findings). CDK and Terraform as authoring alternatives only (§7).
//
// Outcome: Interpret infrastructure and release artefacts, explain the impact of a proposed change, and
// identify state, identity, and rollback assumptions requiring review.
//
// Bridge: Reproducibility supports operations but does not establish health; next we connect telemetry,
// incident response, and recovery evidence. (Spoken as the last line of §7's narration.)
export const delivery: Course = {
  id: 'delivery',
  title: 'Repeatable Infrastructure and Delivery',
  sections: [
    declarativeInfrastructure,
    cloudformationStacks,
    parametersOutputsSecrets,
    changeSetsAndDrift,
    rollbackAndStatefulResources,
    cicdAndDeploymentStrategies,
    promotionAndProvenance,
  ],
}
