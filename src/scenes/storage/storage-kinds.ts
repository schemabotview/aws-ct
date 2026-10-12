import type { Scene } from '@graphlearning/flow'

// §5.1 — object, block and file storage for the shop's data, compared on interface, who can attach,
// and where the persistence boundary sits. An EBS volume lives in one AZ and attaches to instances
// there; EFS is a Regional NFS file system with a mount target per AZ; S3 is a Regional object store
// reached by HTTPS API.
// source: https://docs.aws.amazon.com/decision-guides/latest/decision-guides/choosing-aws-storage-service.html
export const storageKinds: Scene = {
  id: 'storage-kinds',
  title: 'Object, block and file',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'kinds',
      label: 'Three interfaces to bytes',
      pattern: 'group',
      cols: 3,
      children: [
        { id: 'k-object', label: 'Object · S3', sub: 'whole objects by key', pattern: 'storage', icon: 's3' },
        { id: 'k-block', label: 'Block · EBS', sub: 'a disk for one server', pattern: 'storage', icon: 'ebs' },
        { id: 'k-file', label: 'File · EFS', sub: 'a shared directory', pattern: 'storage', icon: 'efs' },
      ],
    },
    {
      id: 'choice',
      kind: 'table',
      label: 'Storage choice for the shop',
      sub: 'access semantics first, price second',
      headers: ['', 'S3', 'EBS', 'EFS'],
      values: [
        ['interface', 'HTTPS API', 'a block device', 'NFS mount'],
        ['who reads', 'anyone allowed', 'one instance*', 'many instances'],
        ['scope', 'Region', 'one AZ', 'Region'],
        ['update', 'replace object', 'change bytes', 'change bytes'],
        ['shop data', 'images, exports', 'build cache', 'invoice PDFs'],
      ],
    },
    {
      id: 'boundary',
      kind: 'list',
      framed: true,
      label: 'Where does it outlive the server?',
      icon: 'lock',
      pattern: 'network',
      items: [
        'instance store: gone when the instance stops',
        'EBS: survives the instance, not its AZ',
        'S3 and EFS: survive an AZ',
        '* multi-attach exists for special cases',
      ],
    },
  ],
  edges: [],
}
