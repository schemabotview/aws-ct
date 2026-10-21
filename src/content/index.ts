import { whyCloud } from './why-cloud'
import { howAwsRuns } from './how-aws-runs'
import { start } from './start'
import { secure } from './secure'
import { network } from './network'
import type { Course, Section } from './types'

// Course registry, in plan order (AWS-COURSE-PLAN.md). A course is registered here only once
// it is authored. Reset on 2026-10-21: the previous 12-chapter course was deleted for a re-plan.
export const COURSES: Record<string, Course> = {
  [whyCloud.id]: whyCloud,
  [howAwsRuns.id]: howAwsRuns,
  [start.id]: start,
  [secure.id]: secure,
  [network.id]: network,
}

export type { Course, Section }

// slugOf / allSections are the shell's — the slug rule (`<courseId>-<sectionId>`) is part of the
// route contract every recorder drives, so it cannot be a per-repo decision. Re-exported here
// because this module is what the app and the scripts import them from.
export { slugOf, allSections } from '@graphlearning/shell'

export function getCourse(id: string): Course | undefined {
  return COURSES[id]
}
