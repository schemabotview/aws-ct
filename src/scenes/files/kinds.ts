import type { Scene, SceneNode } from '@graphlearning/flow'

// Object storage (S3: whole objects by key over HTTPS, Regional), block storage (EBS: a disk for one
// instance in one AZ), file storage (EFS: NFS shared by many instances across AZs; FSx for Windows,
// Lustre, NetApp ONTAP, OpenZFS).
// source: https://docs.aws.amazon.com/decision-guides/latest/decision-guides/choosing-aws-storage-service.html
const kind = (id: string, label: string, sub: string, icon: string, items: string[], pattern: SceneNode['pattern']): SceneNode =>
  ({ id, kind: 'list', label, sub, icon, pattern, items })

export const kinds: Scene = {
  id: 'storage-kinds',
  padding: 0.04,
  header: 'band',
  nodes: [
    {
      id: 'three',
      label: 'Three ways to keep bytes',
      bare: true,
      flow: 'LR',
      align: 'start',
      stretch: true,
      children: [
        kind('k-object', 'Object · S3', 'whole objects, by key, over HTTPS', 's3', ['GET and PUT a whole object; no edits in place', 'Any number of readers, from anywhere', 'Regional: copies in three or more AZs', 'The shop: products, photos, reports'], 'storage'),
        kind('k-block', 'Block · EBS', 'a disk for one server', 'ebs', ['Read and write any byte, like a local disk', 'Attached to one instance, in one AZ', 'Survives a reboot; a snapshot survives the AZ', 'The shop: a server’s own disk, the invoice volume'], 'service'),
        kind('k-file', 'File · EFS', 'a shared folder, over NFS', 'efs', ['Files and directories, opened by many servers', 'Mounted in every AZ at once', 'Grows and shrinks with what is stored', 'The shop: invoices shared by the app servers'], 'network'),
      ],
    },
    {
      id: 'choose-row',
      label: 'Choosing',
      bare: true,
      flow: 'LR',
      align: 'start',
      children: [
        {
          id: 'choose',
          kind: 'table',
          label: 'Which kind, for which job',
          headers: ['need', 'choose'],
          values: [
            ['files served to browsers, at any scale', 'S3'],
            ['a database’s or an OS’s own disk', 'EBS'],
            ['one folder, written by many servers', 'EFS'],
            ['Windows shares, HPC, NetApp, ZFS', 'FSx, the matching kind'],
          ],
        },
        {
          id: 'persist',
          kind: 'list',
          icon: 'harddrive',
          label: 'What survives what',
          pattern: 'storage',
          items: [
            'A server replaced: S3 and EFS untouched; its EBS disk deleted by default',
            'An AZ lost: S3 and EFS keep serving; that AZ’s EBS volumes are gone with it',
            'A mistaken delete: only versioning or a backup brings it back — §5, §7',
          ],
        },
      ],
    },
  ],
  edges: [],
}
