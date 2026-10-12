import type { Scene } from '@graphlearning/flow'
import { foundationsScenes } from './foundations'
import { identityScenes } from './identity'
import { networkingScenes } from './networking'
import { computeScenes } from './compute'
import { storageScenes } from './storage'
import { databasesScenes } from './databases'
import { integrationScenes } from './integration'

// Scene registry. Sections reference scenes by id; scenes are grouped by course (one folder each,
// mirroring src/content). Ids are globally unique across courses, so the flat lookup below is
// unambiguous. Courses are added here as each is authored.
const ALL: Scene[] = [...foundationsScenes, ...identityScenes, ...networkingScenes, ...computeScenes, ...storageScenes, ...databasesScenes, ...integrationScenes]

export const SCENES: Record<string, Scene> = Object.fromEntries(ALL.map((s) => [s.id, s]))

export function getScene(id: string): Scene | undefined {
  return SCENES[id]
}
