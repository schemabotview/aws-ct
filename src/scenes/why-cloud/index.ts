import type { Scene } from '@graphlearning/flow'
import { oneServer } from './one-server'
import { elastic } from './elastic'
import { managed } from './managed'
import { responsibility } from './responsibility'
import { build } from './build'

export const whyCloudScenes: Scene[] = [oneServer, elastic, managed, responsibility, build]
