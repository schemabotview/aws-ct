import type { Scene } from '@graphlearning/flow'
import { scriptsTwice } from './scripts-twice'
import { declarative } from './declarative'
import { firstStack } from './first-stack'
import { params } from './params'
import { changeSets } from './change-sets'
import { rollback } from './rollback'
import { release } from './release'
import { promotion } from './promotion'

export const automateScenes: Scene[] = [scriptsTwice, declarative, firstStack, params, changeSets, rollback, release, promotion]
