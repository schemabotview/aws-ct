import type { Section } from '../types'

export const ebsAndSnapshots: Section = {
  id: 'ebs-and-snapshots',
  title: 'EBS volumes, attachment/lifecycle decisions, snapshots, and recovery',
  scene: 'ebs-snapshot',
  focus: 'ebs-out',
  slide: `## EBS volumes and snapshots

**Objective:** move or recover a volume across AZs.

### Mental model
- An **EBS volume** lives in one AZ and attaches to servers there
- A **snapshot** is a point-in-time copy, Regional and incremental
- Restore = a **new volume** from a snapshot, in any AZ

### Worked example: emulated
- 30 GiB gp3 volume in **eu-west-2a**
- Snapshot: **completed**, not tied to an AZ
- Restored as a new 30 GiB volume in **eu-west-2b**

### Misconception
- "A snapshot restore is instant" — blocks load lazily unless pre-warmed

### Explanation summary
- Volumes are zonal; snapshots carry data between zones`,
  narration:
    "Block volumes have a boundary we met in chapter one: an E B S volume lives in one Availability Zone and can only attach to instances in that zone. If the zone is lost, so is the volume's availability. Snapshots are the way across. A snapshot is a point in time copy of a volume, stored Regionally, and later snapshots store only the blocks that changed, so they are incremental. To recover, you never repair the old volume; you create a new volume from a snapshot, in any zone you choose. The program runs that sequence in an emulator. It creates a thirty gibibyte g p three volume for the invoice service in E U west two a. It takes the nightly snapshot, which completes and belongs to the Region rather than a zone. Then, imagining zone a is lost, it creates a new thirty gibibyte volume from that snapshot in E U west two b, ready to attach to a replacement server there. Two cautions come with real E B S that an emulator does not show. First, a volume restored from a snapshot loads its blocks lazily from storage the first time they are read, so early reads are slow, unless you pay for fast snapshot restore in that zone. Second, a snapshot only contains what was on disk at that moment; data written after it, or still in an application's memory, is not there. The misconception is that a restore is instant and complete. Plan for the warm up, and for the data since the last snapshot. Volumes are zonal; snapshots carry data between zones.",
}
