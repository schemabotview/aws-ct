import type { Scene } from '@graphlearning/flow'
import { ideFrame } from '../ide'
import { filesTree } from './tree'
import code from '../../../spine/files/05-versions/project/tools/versions.py?raw'
import session from '../../../spine/files/05-versions/session.txt?raw'

// With versioning, a PUT adds a version and a DELETE adds a delete marker; removing the marker
// restores the object. Lifecycle rules expire noncurrent versions and transition objects between
// storage classes; STANDARD_IA charges per GB retrieved and has a 30-day minimum; Glacier Flexible
// Retrieval restores in minutes to hours. The emulator's version listing mislabels "latest" after a
// delete, so versions.py follows the ids each call returns.
// source: https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html
// source: https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lifecycle-mgmt.html
// source: https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html
export const versions: Scene = ideFrame(
  'version-timeline',
  'shop-on-aws',
  filesTree('05', 'tools/versions.py', ['infra/s3/catalog-lifecycle.json', 'tools/versions.py']),
  { file: 'tools/versions.py', code, show: [[8, 23]], highlight: [16, 17, 18, 21, 22], terminal: session },
  {
    id: 'versions-pane',
    label: 'side',
    bare: true,
    children: [
      {
        id: 'lifecycle',
        kind: 'table',
        label: 'catalog-lifecycle.json',
        headers: ['rule', 'does'],
        values: [
          ['old-versions', 'expire after 30 days'],
          ['exports, day 30', 'to STANDARD_IA'],
          ['exports, day 90', 'to GLACIER'],
        ],
      },
      {
        id: 'classes',
        kind: 'list',
        icon: 'history',
        label: 'Cheaper to keep, dearer to read',
        pattern: 'storage',
        items: [
          'IA: pay per GB read, 30 days minimum',
          'Glacier: restore takes minutes to hours',
          'Noncurrent versions cost like any data',
          'Versioning undoes a delete; not a backup',
        ],
      },
    ],
  },
)
