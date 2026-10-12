import type { Course } from '../types'
import { addressesAndCidr } from './01-addresses-and-cidr'
import { vpcAndSubnetLayout } from './02-vpc-and-subnet-layout'
import { routeTables } from './03-route-tables'
import { publicAndPrivateConnectivity } from './04-public-and-private-connectivity'
import { securityGroupsAndNacls } from './05-security-groups-and-nacls'
import { dnsAndRoute53 } from './06-dns-and-route-53'
import { tlsAndCertificates } from './07-tls-and-certificates'
import { loadBalancersAndHealth } from './08-load-balancers-and-health'
import { privateConnectivity } from './09-private-connectivity'

// Chapter 3 of AWS-COURSE-PLAN.md — 9 of 9 sections, one scene each.
//
// Objective: Explain the network path from a client to an application and its private dependencies.
//
// Worked illustrations (from the plan): a browser → DNS → load balancer → application → database
// diagram (§6 `dns-resolution`, §7 `tls-path`); a small CIDR calculation (§1 `cidr-plan`, run); annotated
// routes and security-group rules (§3 `route-selection`, §5 `traffic-filters`); a private application that
// cannot reach an external API (§4 `private-egress`). Reachability vs authentication vs authorisation is
// contrasted in §5/§7; why a public subnet alone is not internet-accessible in §4; why connectivity does
// not imply encryption in §7.
//
// Outcome: Trace a request and its return path, interpret basic routing and filtering decisions, and
// identify a plausible cause of a connectivity failure.
//
// Bridge: With request paths established, next we choose where application processing runs and how
// capacity changes. (Spoken as the last line of §9's narration.)
export const networking: Course = {
  id: 'networking',
  title: 'Networking and the Request Path',
  sections: [
    addressesAndCidr,
    vpcAndSubnetLayout,
    routeTables,
    publicAndPrivateConnectivity,
    securityGroupsAndNacls,
    dnsAndRoute53,
    tlsAndCertificates,
    loadBalancersAndHealth,
    privateConnectivity,
  ],
}
