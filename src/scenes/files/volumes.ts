import type { Scene } from '@graphlearning/flow'
import { BUILT_BY, mapFrame } from '../map'
import session from '../../../spine/files/06-volumes/session.txt?raw'

// An EBS volume lives in one AZ; snapshots are stored regionally and can create a volume in any AZ
// of the Region. EFS file systems are Regional with a mount target per AZ. FSx offers Windows File
// Server, Lustre, NetApp ONTAP and OpenZFS file systems.
// source: https://docs.aws.amazon.com/ebs/latest/userguide/ebs-snapshots.html
// source: https://docs.aws.amazon.com/efs/latest/ug/how-it-works.html
// source: https://docs.aws.amazon.com/fsx/
export const volumes: Scene = mapFrame('ebs-snapshot', BUILT_BY[7], {
  id: 'volumes-pane',
  label: 'side',
  bare: true,
  children: [
    { id: 'volumes-run', kind: 'terminal', filename: 'Terminal — shop-on-aws · emulated', label: session.replace(/\n+$/, '') },
    {
      id: 'move',
      kind: 'table',
      label: 'Moving the invoice disk from eu-west-2a to eu-west-2b',
      headers: ['step', 'where it lives'],
      values: [
        ['the volume, 30 GiB gp3', 'eu-west-2a only'],
        ['its snapshot', 'the Region, in S3, out of sight'],
        ['a new volume from it', 'eu-west-2b'],
      ],
    },
    {
      id: 'file-choices',
      kind: 'table',
      label: 'Shared files',
      headers: ['need', 'service'],
      values: [
        ['Linux servers share a folder', 'EFS: NFS, a mount target in each AZ'],
        ['Windows file shares', 'FSx for Windows File Server'],
        ['fast scratch for big compute jobs', 'FSx for Lustre'],
        ['NetApp or ZFS features', 'FSx for NetApp ONTAP / OpenZFS'],
      ],
    },
  ],
})
