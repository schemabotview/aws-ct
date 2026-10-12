import type { Section } from '../types'

export const sharedFileStorage: Section = {
  id: 'shared-file-storage',
  title: 'Shared file access with EFS and workload-driven FSx selection',
  scene: 'shared-files',
  focus: 'mounts',
  slide: `## Shared files with EFS and FSx

**Objective:** pick a shared file system from the protocol and the workload.

### Mental model
- **EFS:** NFS for Linux, Regional, mount target per AZ, grows itself
- **FSx:** managed file systems for other protocols and workloads
- Encryption at rest is set when the file system is created

### Worked example: invoice workers
- Workers in AZs a, b and c mount **/mnt/invoices**
- One file system: elastic throughput, **encrypted**
- Windows reporting share? → **FSx for Windows**

### Misconception
- "Just share an EBS volume" — a volume belongs to one AZ, usually one server

### Explanation summary
- EFS for Linux NFS; FSx when protocol or performance demands it`,
  narration:
    "Some applications genuinely need a shared directory. The shop's invoice workers generate P D F invoices that other workers read and bundle, and they run in all three zones. E F S fits. It is an N F S file system for Linux, Regional rather than zonal, with a mount target in each zone, so every worker mounts the same slash m n t slash invoices from its own zone. It grows and shrinks with the files stored. The request on the board, validated against the E F S A P I, creates the file system with the general purpose performance mode, elastic throughput, which scales with demand, and encryption at rest, which is chosen at creation time. When the protocol or the workload is different, F S x offers managed file systems built for it. The table maps needs to choices. Windows file shares over S M B, joined to Active Directory, go to F S x for Windows File Server. Scratch space for very high throughput computing goes to F S x for Lustre. Teams that rely on NetApp features use F S x for O N T A P, and those that want Z F S snapshots and clones use F S x for Open Z F S. The misconception is that you can just share an E B S volume. A volume belongs to one zone and, except in special multi attach cases, to one server at a time. So choose E F S for shared Linux files, and F S x when the protocol or the performance profile demands something else.",
}
