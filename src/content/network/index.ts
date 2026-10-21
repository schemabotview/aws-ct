import type { Course } from '../types'
import { addressesCidrAndPorts } from './01-addresses-cidr-and-ports'
import { aVpcAcrossThreeAzs } from './02-a-vpc-across-three-azs'
import { routeTables } from './03-route-tables'
import { goingOutFromAPrivateSubnet } from './04-going-out-from-a-private-subnet'
import { securityGroupsAndNetworkAcls } from './05-security-groups-and-network-acls'
import { aNameForTheShop } from './06-a-name-for-the-shop'
import { tlsAlongThePath } from './07-tls-along-the-path'
import { theLoadBalancer } from './08-the-load-balancer'
import { privatePathsAndHybridLinks } from './09-private-paths-and-hybrid-links'

// Course 5 — Give it a network. The address plan, the VPC and its nine subnets, routes, NAT,
// security groups, DNS, TLS, the load balancer and its health checks, and private paths.
export const network: Course = {
  id: 'network',
  title: 'Give it a network',
  sections: [addressesCidrAndPorts, aVpcAcrossThreeAzs, routeTables, goingOutFromAPrivateSubnet, securityGroupsAndNetworkAcls, aNameForTheShop, tlsAlongThePath, theLoadBalancer, privatePathsAndHybridLinks],
}
