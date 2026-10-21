import type { Course } from '../types'
import { oneShopOneServer } from './01-one-shop-one-server'
import { rentingInsteadOfOwning } from './02-renting-instead-of-owning'
import { managedServices } from './03-managed-services'
import { sharedResponsibility } from './04-shared-responsibility'
import { whatWeWillBuild } from './05-what-we-will-build'

// Course 1 — Why the cloud. The picture before any command: what renting capacity and services
// changes, who is responsible for what, and the finished shop as the course's map.
export const whyCloud: Course = {
  id: 'why-cloud',
  title: 'Why the cloud',
  sections: [oneShopOneServer, rentingInsteadOfOwning, managedServices, sharedResponsibility, whatWeWillBuild],
}
