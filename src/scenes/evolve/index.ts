import type { Scene } from '@graphlearning/flow'
import { measure } from './measure'
import { cdn } from './cdn'
import { rightsize } from './rightsize'
import { allocation } from './allocation'
import { bill } from './bill'
import { sustain } from './sustain'
import { adr } from './adr'
import { platforms } from './platforms'
import { region } from './region'
import { cutover } from './cutover'
import { review } from './review'

export const evolveScenes: Scene[] = [measure, cdn, rightsize, allocation, bill, sustain, adr, platforms, region, cutover, review]
