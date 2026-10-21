import type { Course } from '../types'
import { theFinishedProjectToured } from './01-the-finished-project-toured'
import { theAccountAndItsRootUser } from './02-the-account-and-its-root-user'
import { aFirstSession } from './03-a-first-session'
import { theEmulatorBesideAws } from './04-the-emulator-beside-aws'
import { theFirstResource } from './05-the-first-resource'
import { billingBudgetsAndCleanup } from './06-billing-budgets-and-cleanup'

// Course 3 — Start the project. shop-on-aws on disk: the root user locked away, a first SSO session,
// the emulator every later command runs against, the first bucket, and a price and a teardown.
export const start: Course = {
  id: 'start',
  title: 'Start the project',
  sections: [theFinishedProjectToured, theAccountAndItsRootUser, aFirstSession, theEmulatorBesideAws, theFirstResource, billingBudgetsAndCleanup],
}
