import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { secureTree } from './tree'
import code from '../../../spine/secure/08-guardrails/project/policies/scp-regions.json?raw'
import session from '../../../spine/secure/08-guardrails/session.txt?raw'

// SCPs set the maximum permissions for principals in member accounts and never grant anything; they
// do not apply to the management account. RCPs set the maximum permissions on resources. Delegated
// administration lets a member account (audit) run a service for the organization. The emulator
// stores and attaches the policy; it does not enforce SCPs, so their effect is the documentation's.
// source: https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scps.html
// source: https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_rcps.html
// source: https://docs.aws.amazon.com/organizations/latest/userguide/orgs_integrate_services_list.html
export const guardrails: Scene = ideFrame(
  'guardrails',
  'shop-on-aws',
  secureTree('08', 'policies/scp-regions.json', ['policies/scp-regions.json', 'infra/04-guardrails.sh']),
  { file: 'policies/scp-regions.json', code, highlight: [6, 7, 12, 13], terminal: session },
  {
    id: 'guardrails-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'kinds',
        kind: 'table',
        label: 'Policies that grant, policies that cap',
        headers: ['policy', 'role'],
        values: [
          ['identity', 'grants a principal'],
          ['resource', 'grants on a resource'],
          ['SCP', 'caps principals in an OU'],
          ['RCP', 'caps resources in an OU'],
        ],
      },
      {
        id: 'audit',
        kind: 'list',
        icon: 'shieldcheck',
        label: 'Guardrails and who audits',
        pattern: 'warn',
        items: [
          'An SCP grants nothing; it only removes',
          'NotAction keeps global services working',
          'The audit account is delegated admin for logs',
          'The emulator attaches it; AWS enforces it',
        ],
      },
    ],
  },
)
