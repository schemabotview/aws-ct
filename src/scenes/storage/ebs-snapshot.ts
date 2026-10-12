import type { Scene } from '@graphlearning/flow'

// §5.5 — a block volume tied to its AZ, and its snapshot as the way out: the invoice service's 30 GiB
// gp3 volume in eu-west-2a is snapshotted (snapshots are Regional and incremental) and restored as a
// new volume in eu-west-2b. Run in moto (emulated): it models the API, not restore performance, which
// on real EBS loads blocks lazily unless fast snapshot restore is enabled.
// source: https://docs.aws.amazon.com/ebs/latest/userguide/ebs-restoring-volume.html
// source: https://docs.aws.amazon.com/ebs/latest/userguide/ebs-fast-snapshot-restore.html
export const ebsSnapshot: Scene = {
  id: 'ebs-snapshot',
  title: 'A volume lives in one AZ; its snapshot does not',
  flow: 'TB',
  padding: 0.12,
  nodes: [
    {
      id: 'ebs',
      kind: 'code',
      filename: 'snapshot_restore.py · emulated',
      hug: true,
      label: `import boto3
from moto import mock_aws

with mock_aws():
    ec2 = boto3.client("ec2", region_name="eu-west-2")
    vol = ec2.create_volume(AvailabilityZone="eu-west-2a",
                            Size=30, VolumeType="gp3")
    print("volume in", vol["AvailabilityZone"],
          f"{vol['Size']} GiB", vol["State"])

    snap = ec2.create_snapshot(VolumeId=vol["VolumeId"],
                               Description="invoice-cache nightly")
    snap = ec2.describe_snapshots(
        SnapshotIds=[snap["SnapshotId"]])["Snapshots"][0]
    print("snapshot", snap["State"], "- Regional, not in an AZ")

    # app-a's AZ is lost: restore the data in eu-west-2b
    new = ec2.create_volume(AvailabilityZone="eu-west-2b",
                            SnapshotId=snap["SnapshotId"],
                            VolumeType="gp3")
    print("restored in", new["AvailabilityZone"],
          f"{new['Size']} GiB from the snapshot")`,
    },
    {
      id: 'ebs-out',
      kind: 'code',
      filename: 'output',
      hug: true,
      label: `volume in eu-west-2a 30 GiB available
snapshot completed - Regional, not in an AZ
restored in eu-west-2b 30 GiB from the snapshot`,
    },
  ],
  edges: [],
}
