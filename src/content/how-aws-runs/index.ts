import type { Course } from '../types'
import { regionsAndAvailabilityZones } from './01-regions-and-availability-zones'
import { globalRegionalAndZonalServices } from './02-global-regional-and-zonal-services'
import { everyActionIsAnApiCall } from './03-every-action-is-an-api-call'
import { anatomyOfARequest } from './04-anatomy-of-a-request'
import { arnsAndResourceIdentity } from './05-arns-and-resource-identity'
import { whatKeepsCharging } from './06-what-keeps-charging'

// Course 2 — How AWS runs a request. Where things run, at what scope, how every action is a signed
// API call, how resources are named, and which meters keep running.
export const howAwsRuns: Course = {
  id: 'how-aws-runs',
  title: 'How AWS runs a request',
  sections: [regionsAndAvailabilityZones, globalRegionalAndZonalServices, everyActionIsAnApiCall, anatomyOfARequest, arnsAndResourceIdentity, whatKeepsCharging],
}
