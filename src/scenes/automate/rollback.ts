import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { automateTree } from './tree'
import code from '../../../spine/automate/06-rollback/project/templates/orders-db.yaml?raw'
import session from '../../../spine/automate/06-rollback/session.txt?raw'

// A failed update rolls the stack back to its previous template; it does not undo what code or a
// migration did to data. DeletionPolicy and UpdateReplacePolicy (Retain or Snapshot) protect a
// stateful resource when the stack deletes or replaces it; DeletionProtection stops RDS deleting the
// instance at all. The events table is illustrative: the emulator does not roll back failed updates.
// source: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-rollback-triggers.html
// source: https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-attribute-deletionpolicy.html
// source: https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-attribute-updatereplacepolicy.html
export const rollback: Scene = ideFrame(
  'rollback-and-protection',
  'shop-on-aws',
  automateTree('06', 'templates/orders-db.yaml', ['templates/orders-db.yaml']),
  { file: 'templates/orders-db.yaml', code, show: [[12, 27]], highlight: [13, 14, 22, 24, 26], terminal: session, emulated: false },
  {
    id: 'rollback-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'events',
        kind: 'table',
        label: 'A failed update, v14 → v15 · illustrative',
        headers: ['time', 'event'],
        values: [
          ['18:39', 'migration adds a column'],
          ['18:41', 'v15 resource fails'],
          ['18:41', 'rollback to v14 starts'],
          ['18:44', 'v14 restored'],
        ],
      },
      {
        id: 'cannot-undo',
        kind: 'list',
        icon: 'history',
        label: 'What rollback cannot undo',
        pattern: 'warn',
        items: [
          'The migration ran: the column stays',
          'Make changes that v14 can live with',
          'Snapshot on delete and on replace',
          'DeletionProtection: no delete at all',
        ],
      },
    ],
  },
)
