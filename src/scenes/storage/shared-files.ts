import type { Scene } from '@graphlearning/flow'

// §5.6 — shared files. The invoice workers in all three AZs mount one EFS file system (Regional,
// NFS, a mount target per AZ). The CreateFileSystem request is validated in full. FSx covers
// workloads EFS does not: SMB/Windows, Lustre for HPC-style throughput, NetApp ONTAP, OpenZFS.
// source: https://docs.aws.amazon.com/efs/latest/ug/how-it-works.html
// source: https://docs.aws.amazon.com/fsx/
export const sharedFiles: Scene = {
  id: 'shared-files',
  title: 'One directory, many servers',
  flow: 'TB',
  padding: 0.05,
  nodes: [
    {
      id: 'mounts',
      label: 'EFS invoices · one mount target per AZ',
      pattern: 'group',
      cols: 3,
      children: [
        { id: 'w-a', label: 'worker a', sub: 'mounts /mnt/invoices', pattern: 'service', icon: 'ec2' },
        { id: 'w-b', label: 'worker b', sub: 'mounts /mnt/invoices', pattern: 'service', icon: 'ec2' },
        { id: 'w-c', label: 'worker c', sub: 'mounts /mnt/invoices', pattern: 'service', icon: 'ec2' },
      ],
    },
    {
      id: 'create',
      kind: 'code',
      filename: 'efs.CreateFileSystem.request.json · model-checked',
      hug: true,
      label: `{
  "CreationToken": "shop-invoices-1",
  "PerformanceMode": "generalPurpose",
  "ThroughputMode": "elastic",
  "Encrypted": true,
  "Tags": [{ "Key": "App", "Value": "invoices" }]
}`,
    },
    {
      id: 'fsx',
      kind: 'table',
      label: 'When EFS is not the answer',
      sub: 'choose by protocol and workload',
      headers: ['need', 'choose'],
      values: [
        ['Linux servers share files (NFS)', 'EFS'],
        ['Windows shares (SMB), AD', 'FSx for Windows'],
        ['HPC scratch, huge throughput', 'FSx for Lustre'],
        ['NetApp features, multi-protocol', 'FSx for ONTAP'],
        ['ZFS snapshots and clones', 'FSx for OpenZFS'],
      ],
    },
  ],
  edges: [],
}
