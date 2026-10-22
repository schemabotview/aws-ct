import type { Scene } from '@graphlearning/flow'
import { whyCloudScenes } from './why-cloud'
import { howAwsRunsScenes } from './how-aws-runs'
import { startScenes } from './start'
import { secureScenes } from './secure'
import { networkScenes } from './network'
import { runScenes } from './run'
import { automateScenes } from './automate'
import { filesScenes } from './files'
import { ordersScenes } from './orders'
import { decoupleScenes } from './decouple'
import { reportScenes } from './report'
import { operateScenes } from './operate'
import { evolveScenes } from './evolve'

// Scene registry. Sections reference scenes by id; scenes are grouped by course (one folder each,
// mirroring src/content). Ids are globally unique across courses, so the flat lookup below is
// unambiguous. Courses are added here as each is authored.
const ALL: Scene[] = [...whyCloudScenes, ...howAwsRunsScenes, ...startScenes, ...secureScenes, ...networkScenes, ...runScenes, ...automateScenes, ...filesScenes, ...ordersScenes, ...decoupleScenes, ...reportScenes, ...operateScenes, ...evolveScenes]

export const SCENES: Record<string, Scene> = Object.fromEntries(ALL.map((s) => [s.id, s]))

export function getScene(id: string): Scene | undefined {
  return SCENES[id]
}
