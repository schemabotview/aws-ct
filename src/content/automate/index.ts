import type { Course } from '../types'
import { whenTheScriptsStopScaling } from './01-when-the-scripts-stop-scaling'
import { declarativeInfrastructure } from './02-declarative-infrastructure'
import { aFirstStack } from './03-a-first-stack'
import { parametersOutputsAndReferences } from './04-parameters-outputs-and-references'
import { changeSetsAndDrift } from './05-change-sets-and-drift'
import { rollbackAndStatefulResources } from './06-rollback-and-stateful-resources'
import { releasingTheApp } from './07-releasing-the-app'
import { oneArtefactTwoAccounts } from './08-one-artefact-two-accounts'

// Course 7 — Make it repeatable. The scripts' limit shown, then CloudFormation: a first stack,
// parameters and exports, replacement read from the resource schemas, protected stateful resources,
// release strategies (a model), and one artefact promoted through a single trusted role.
export const automate: Course = {
  id: 'automate',
  title: 'Make it repeatable',
  sections: [whenTheScriptsStopScaling, declarativeInfrastructure, aFirstStack, parametersOutputsAndReferences, changeSetsAndDrift, rollbackAndStatefulResources, releasingTheApp, oneArtefactTwoAccounts],
}
