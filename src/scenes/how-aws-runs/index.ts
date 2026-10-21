import type { Scene } from '@graphlearning/flow'
import { regions } from './regions'
import { scopes } from './scopes'
import { api } from './api'
import { anatomy } from './anatomy'
import { arns } from './arns'
import { charges } from './charges'

export const howAwsRunsScenes: Scene[] = [regions, scopes, api, anatomy, arns, charges]
